import { db } from '../../db/index.js';
import { users } from '../../db/schema/core.js';
import { eq, and } from 'drizzle-orm';
import { createId } from '../../utils/id.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'prana_secret_key_change_me';

export const userController = {
	// REGISTRO: Onde o ID nasce
	async register(req, res) {
		try {
			const { name, email, password, full_name , realmId } = req.body;

			if (!email || !password) return res.status(400).json({ error: 'Dados incompletos' });

			// [FIX 1] Garante que a busca por email retorna apenas 1
			const [existing] = await db.select().from(users).where(and(eq(users.email, email), realmId && realmId !== 'all' ? eq(users.realmId, realmId) : undefined)).limit(1);
			if (existing) return res.status(409).json({ error: 'Email já cadastrado' });

			const salt = await bcrypt.genSalt(10);
			const passwordHash = await bcrypt.hash(password, salt);

			const newUser = {
				id: createId('user'), // <--- AQUI O ID É GERADO
				name: name || full_name || email.split('@')[0],
				email,
				password_hash: passwordHash,
				role: 'user',
				credits: 100,
				createdAt: new Date()
			};

			const [createdUser] = await db.insert(users).values(newUser).returning();
			
			// Token contém o ID
			const token = jwt.sign({ id: createdUser.id }, JWT_SECRET, { expiresIn: '7d' });
			const { password_hash: _, ...userSafe } = createdUser;

			res.status(201).json({ user: userSafe, token });

		} catch (error) {
			console.error('Erro no registro:', error);
			res.status(500).json({ error: 'Erro interno' });
		}
	},

	// LOGIN: Onde o ID é recuperado
	async login(req, res) {
		try {
			const { email, password , realmId } = req.body;
			
			// [FIX 2] Simplifica a busca e garante retorno de um único objeto
			const [user] = await db.select().from(users).where(and(eq(users.email, email), realmId && realmId !== 'all' ? eq(users.realmId, realmId) : undefined)).limit(1);

			if (!user) return res.status(401).json({ error: 'Credenciais inválidas' });

			const isMatch = await bcrypt.compare(password, user.password_hash);
			if (!isMatch) return res.status(401).json({ error: 'Credenciais inválidas' });

			const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
			const { password_hash, ...userSafe } = user;
			
			res.json({ user: userSafe, token }); // Retorna o objeto user COM o ID

		} catch (error) {
			console.error(error);
			res.status(500).json({ error: 'Erro no login' });
		}
	},

	// ME: Validação da Sessão
	async me(req, res) {
		try {
			const authHeader = req.headers.authorization;
			if (!authHeader) return res.status(401).json({ error: 'Sem token' });

			const token = authHeader.split(' ')[1];
			const decoded = jwt.verify(token, JWT_SECRET); // Decodifica o ID do token

			// [FIX 3] Simplifica a busca e garante retorno de um único objeto
			const [user] = await db.select().from(users).where(and(eq(users.id, decoded.id), realmId && realmId !== 'all' ? eq(users.realmId, realmId) : undefined)).limit(1);

			if (!user) return res.status(404).json({ error: 'User not found' });

			const { password_hash, ...userSafe } = user;
			res.json(userSafe);

		} catch (error) {
			res.status(401).json({ error: 'Token inválido' });
		}
	},
	
	// Métodos auxiliares para rotas de admin/perfil
	async getUserById(req, res) {
		try {
			const { id , realmId } = req.params;
			// [FIX 4] Adiciona limit(1) para garantir o retorno único
			const [user] = await db.select().from(users).where(and(eq(users.id, id), realmId && realmId !== 'all' ? eq(users.realmId, realmId) : undefined)).limit(1); 
			if (!user) return res.status(404).json({error: "User not found"});
			const { password_hash, ...safe } = user;
			res.json(safe);
		} catch(e) { res.status(500).json({error: e.message}); }
	},

	async updateUserProfile(req, res) {
		try {
			const { id , realmId } = req.params;
			const { name, email } = req.body; // Só permite atualizar dados básicos aqui
			const [updated] = await db.update(users).set({ name, email, updatedAt: new Date() }).where(and(eq(users.id, id), realmId && realmId !== 'all' ? eq(users.realmId, realmId) : undefined)).returning();
			const { password_hash, ...safe } = updated;
			res.json(safe);
		} catch(e) { res.status(500).json({error: e.message}); }
	},

	// ============================================================================
	// NOVOS MÉTODOS: Profile Management, Password Reset, Logout
	// ============================================================================

	async getProfile(req, res) {
		try {
			const { userId , realmId } = req.body;
			if (!userId) return res.status(400).json({ error: 'userId é obrigatório' });

			const [user] = await db.select().from(users).where(and(eq(users.id, userId), realmId && realmId !== 'all' ? eq(users.realmId, realmId) : undefined)).limit(1);
			if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

			const { password_hash, ...safe } = user;
			res.json({ success: true, data: safe });
		} catch (error) {
			console.error('Erro ao obter perfil:', error);
			res.status(500).json({ error: 'Falha ao obter perfil' });
		}
	},

	async updateProfile(req, res) {
		try {
			const { userId, name, email, avatarUrl, aiSettings , realmId } = req.body;
			if (!userId) return res.status(400).json({ error: 'userId é obrigatório' });

			// Verificar se email já existe
			if (email) {
				const [existing] = await db.select().from(users).where(and(eq(users.email, email), realmId && realmId !== 'all' ? eq(users.realmId, realmId) : undefined)).limit(1);
				if (existing && existing.id !== userId) {
					return res.status(409).json({ error: 'Email já em uso' });
				}
			}

			const updateData = {};
			if (name) updateData.name = name;
			if (email) updateData.email = email;
			if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl;
			if (aiSettings) updateData.aiSettings = aiSettings;
			updateData.updatedAt = new Date();

			const [updated] = await db.update(users)
				.set(updateData)
				.where(and(eq(users.id, userId), realmId && realmId !== 'all' ? eq(users.realmId, realmId) : undefined))
				.returning();

			const { password_hash, ...safe } = updated;
			res.json({ success: true, data: safe });
		} catch (error) {
			console.error('Erro ao atualizar perfil:', error);
			res.status(500).json({ error: 'Falha ao atualizar perfil' });
		}
	},

	async requestPasswordReset(req, res) {
		try {
			const { email , realmId } = req.body;
			if (!email) return res.status(400).json({ error: 'Email é obrigatório' });

			const [user] = await db.select().from(users).where(and(eq(users.email, email), realmId && realmId !== 'all' ? eq(users.realmId, realmId) : undefined)).limit(1);

			// Por segurança, sempre retorna sucesso mesmo se email não existe
			if (!user) {
				return res.json({ 
					success: true, 
					message: 'Se o email existir, um link de reset será enviado' 
				});
			}

			// Gerar token de reset
			const resetToken = crypto.randomBytes(32).toString('hex');
			const resetTokenHash = bcrypt.hashSync(resetToken, 10);
			const expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hora

			await db.update(users)
				.set({
					aiSettings: {
						...user.aiSettings,
						passwordResetToken: resetTokenHash,
						passwordResetExpires: expiresAt.toISOString()
					}
				})
				.where(and(eq(users.id, user.id), realmId && realmId !== 'all' ? eq(users.realmId, realmId) : undefined));

			// Em produção, enviar email aqui
			res.json({
				success: true,
				message: 'Link de reset enviado',
				token: resetToken // Apenas para dev
			});
		} catch (error) {
			console.error('Erro ao solicitar reset:', error);
			res.status(500).json({ error: 'Falha ao solicitar reset de senha' });
		}
	},

	async confirmPasswordReset(req, res) {
		try {
			const { userId, token, newPassword, confirmPassword , realmId } = req.body;

			if (!userId || !token || !newPassword) {
				return res.status(400).json({ error: 'Dados incompletos' });
			}

			if (newPassword !== confirmPassword) {
				return res.status(400).json({ error: 'Senhas não conferem' });
			}

			const [user] = await db.select().from(users).where(and(eq(users.id, userId), realmId && realmId !== 'all' ? eq(users.realmId, realmId) : undefined)).limit(1);
			if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

			const resetTokenHash = user.aiSettings?.passwordResetToken;
			const resetExpires = user.aiSettings?.passwordResetExpires;

			if (!resetTokenHash || !resetExpires) {
				return res.status(400).json({ error: 'Token de reset não encontrado' });
			}

			if (new Date() > new Date(resetExpires)) {
				return res.status(400).json({ error: 'Token de reset expirou' });
			}

			if (!bcrypt.compareSync(token, resetTokenHash)) {
				return res.status(400).json({ error: 'Token inválido' });
			}

			const hashedPassword = bcrypt.hashSync(newPassword, 10);

			await db.update(users)
				.set({
					password_hash: hashedPassword,
					aiSettings: {
						...user.aiSettings,
						passwordResetToken: null,
						passwordResetExpires: null
					},
					updatedAt: new Date()
				})
				.where(and(eq(users.id, userId), realmId && realmId !== 'all' ? eq(users.realmId, realmId) : undefined));

			res.json({ success: true, message: 'Senha resetada com sucesso' });
		} catch (error) {
			console.error('Erro ao confirmar reset:', error);
			res.status(500).json({ error: 'Falha ao resetar senha' });
		}
	},

	logout(req, res) {
		res.json({ success: true, message: 'Logout realizado com sucesso' });
	},

	async changePassword(req, res) {
		try {
			const { userId, currentPassword, newPassword, confirmPassword , realmId } = req.body;

			if (!userId || !currentPassword || !newPassword) {
				return res.status(400).json({ error: 'Dados incompletos' });
			}

			if (newPassword !== confirmPassword) {
				return res.status(400).json({ error: 'Senhas não conferem' });
			}

			const [user] = await db.select().from(users).where(and(eq(users.id, userId), realmId && realmId !== 'all' ? eq(users.realmId, realmId) : undefined)).limit(1);
			if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

			if (!bcrypt.compareSync(currentPassword, user.password_hash)) {
				return res.status(401).json({ error: 'Senha atual está incorreta' });
			}

			const hashedPassword = bcrypt.hashSync(newPassword, 10);

			await db.update(users)
				.set({
					password_hash: hashedPassword,
					updatedAt: new Date()
				})
				.where(and(eq(users.id, userId), realmId && realmId !== 'all' ? eq(users.realmId, realmId) : undefined));

			res.json({ success: true, message: 'Senha alterada com sucesso' });
		} catch (error) {
			console.error('Erro ao mudar senha:', error);
			res.status(500).json({ error: 'Falha ao mudar senha' });
		}
	},

	// Salvar device token para notificações push
	async saveDeviceToken(req, res) {
		try {
			const userId = req.user?.id;
			const { token , realmId } = req.body;

			if (!userId || !token) {
				return res.status(400).json({ error: 'userId e token são obrigatórios' });
			}

			// Salvar/atualizar device token no perfil do usuário
			await db.update(users)
				.set({
					deviceToken: token,
					updatedAt: new Date()
				})
				.where(and(eq(users.id, userId), realmId && realmId !== 'all' ? eq(users.realmId, realmId) : undefined));

			res.json({ success: true, message: 'Device token salvo com sucesso' });
		} catch (error) {
			console.error('Erro ao salvar device token:', error);
			res.status(500).json({ error: 'Falha ao salvar device token' });
		}
	}
};

import crypto from 'crypto';