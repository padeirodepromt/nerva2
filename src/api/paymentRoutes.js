import express from 'express';
import axios from 'axios';
import { db } from '../db/index.js'; 
import { users, plans } from '../../db/schema/core.js'; 
import { eq } from 'drizzle-orm';
import { authenticate } from './authMiddleware.js'; 

const router = express.Router();

const ASAAS_API_URL = process.env.ASAAS_API_URL || 'https://sandbox.asaas.com/api/v3';
const ASAAS_API_KEY = process.env.ASAAS_API_KEY;

// Mapeia os IDs usados no Front (planId) para as Keys no Banco de Dados
const PLANS_MAPPING = {
    'seed': 'SEED',
    'root': 'ROOT',
    'trunk': 'TRUNK',
    'crown': 'CROWN'
};

// Mapa de Valores para validação (Evita fraudes de preço no frontend)
const PLANS_VALUES = {
    'ROOT': 49.00,
    'TRUNK': 129.00,
    'CROWN': 399.00
};

router.post('/transparent', authenticate, async (req, res) => {
    try {
        const userId = req.user.id;
        const { 
            name, email, cpfCnpj, planId, 
            paymentMethod, creditCard, creditCardHolderInfo 
        } = req.body;

        if (!ASAAS_API_KEY) return res.status(500).json({ error: 'Erro de configuração no servidor (API Key).' });

        // Normaliza a chave do plano
        const dbPlanKey = PLANS_MAPPING[planId?.toLowerCase()] || planId;
        const planValue = PLANS_VALUES[dbPlanKey];

        if (!planValue) return res.status(400).json({ error: 'Plano inválido ou não encontrado.' });

        // 1. Criar/Buscar Cliente no Asaas
        let customerId;
        try {
            const searchRes = await axios.get(`${ASAAS_API_URL}/customers?email=${email}`, {
                headers: { access_token: ASAAS_API_KEY }
            });
            if (searchRes.data.data && searchRes.data.data.length > 0) {
                customerId = searchRes.data.data[0].id;
            } else {
                const createRes = await axios.post(`${ASAAS_API_URL}/customers`, {
                    name, email, cpfCnpj
                }, { headers: { access_token: ASAAS_API_KEY } });
                customerId = createRes.data.id;
            }
        } catch (e) {
            console.error('Asaas Customer Error:', e.response?.data);
            return res.status(400).json({ error: 'Erro ao registrar cliente no gateway.' });
        }

        // 2. Processar Pagamento (CARTÃO DE CRÉDITO)
        if (paymentMethod === 'CREDIT_CARD') {
            try {
                // Cria a assinatura no Asaas
                const subRes = await axios.post(`${ASAAS_API_URL}/subscriptions`, {
                    customer: customerId,
                    billingType: 'CREDIT_CARD',
                    value: planValue,
                    nextDueDate: new Date().toISOString().split('T')[0], // Cobra hoje
                    cycle: 'MONTHLY',
                    description: `Assinatura Prana - Plano ${dbPlanKey}`,
                    creditCard: {
                        holderName: creditCard.holderName,
                        number: creditCard.number,
                        expiryMonth: creditCard.expiryMonth,
                        expiryYear: creditCard.expiryYear,
                        ccv: creditCard.ccv
                    },
                    creditCardHolderInfo: creditCardHolderInfo || {
                        name, email, cpfCnpj,
                        postalCode: '00000-000', addressNumber: 'SN', phone: '00000000000'
                    }
                }, { headers: { access_token: ASAAS_API_KEY } });

                // SUCESSO: Atualiza o Banco de Dados do Prana
                // No cartão, liberamos acesso imediato (Optimistic)
                const [updatedUser] = await db.update(users)
                    .set({ 
                        planType: dbPlanKey,
                        subscriptionId: subRes.data.id,
                        updatedAt: new Date()
                    })
                    .where(eq(users.id, userId))
                    .returning();
                
                const { password_hash, ...userSafe } = updatedUser;

                return res.json({ 
                    success: true, 
                    id: subRes.data.id,
                    user: userSafe // Retorna usuário atualizado para o front
                });

            } catch (cardError) {
                console.error('Asaas Card Error:', cardError.response?.data);
                return res.status(400).json({ 
                    error: 'Pagamento recusado.', 
                    details: cardError.response?.data?.errors?.[0]?.description 
                });
            }
        } 
        
        // 3. Processar Pagamento (PIX)
        else if (paymentMethod === 'PIX') {
            try {
                // Cria assinatura Pix
                const subRes = await axios.post(`${ASAAS_API_URL}/subscriptions`, {
                    customer: customerId,
                    billingType: 'PIX',
                    value: planValue,
                    nextDueDate: new Date().toISOString().split('T')[0],
                    cycle: 'MONTHLY',
                    description: `Assinatura Prana - Plano ${dbPlanKey}`
                }, { headers: { access_token: ASAAS_API_KEY } });

                // Pega a cobrança gerada
                const paymentRes = await axios.get(`${ASAAS_API_URL}/payments?subscription=${subRes.data.id}&limit=1`, {
                    headers: { access_token: ASAAS_API_KEY }
                });
                
                const paymentId = paymentRes.data.data[0].id;
                
                // Gera o QR Code
                const qrRes = await axios.get(`${ASAAS_API_URL}/payments/${paymentId}/pixQrCode`, {
                    headers: { access_token: ASAAS_API_KEY }
                });

                // NOTA: No Pix, NÃO liberamos o plano agora.
                // O Webhook fará isso quando o pagamento for confirmado.
                return res.json({ 
                    success: true, 
                    payload: qrRes.data.payload, 
                    encodedImage: qrRes.data.encodedImage,
                    subscriptionId: subRes.data.id
                });

            } catch (pixError) {
                console.error('Asaas Pix Error:', pixError.response?.data);
                return res.status(400).json({ error: 'Erro ao gerar Pix.' });
            }
        }

    } catch (error) {
        console.error('General Payment Error:', error);
        res.status(500).json({ error: 'Erro interno no processamento.' });
    }
});

export default router;