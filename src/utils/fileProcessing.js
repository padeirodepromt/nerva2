/**
 * src/utils/fileProcessing.js
 * Processa diferentes tipos de arquivos (PDF, DOCX, imagens, etc)
 */

/**
 * Processa um arquivo e extrai seu conteúdo
 * @param {File} file - O arquivo a processar
 * @returns {Promise<{content: string, type: string, preview: string, name: string}>}
 */
export async function processFile(file) {
  const maxFileSize = 10 * 1024 * 1024; // 10MB

  // Validação
  if (file.size > maxFileSize) {
    throw new Error(`Arquivo muito grande (máx 10MB, você tem ${(file.size / 1024 / 1024).toFixed(2)}MB)`);
  }

  const ext = file.name.split('.').pop().toLowerCase();
  const type = file.type;

  // Tipos suportados
  const supportedTypes = {
    // Text
    'text/plain': 'text',
    'text/markdown': 'text',
    'application/pdf': 'pdf',

    // Office
    'application/msword': 'doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    'application/vnd.ms-excel': 'xls',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',

    // Images
    'image/jpeg': 'image',
    'image/png': 'image',
    'image/gif': 'image',

    // Data
    'text/csv': 'csv',
    'application/json': 'json'
  };

  const fileCategory = supportedTypes[type] || (ext && supportedTypes[`.${ext}`]) || 'unknown';

  if (fileCategory === 'unknown') {
    throw new Error(`Tipo de arquivo não suportado: ${type || ext}`);
  }

  let content = '';
  let preview = '';

  try {
    if (fileCategory === 'text') {
      // Arquivo de texto puro
      content = await file.text();
      preview = content.slice(0, 300);

    } else if (fileCategory === 'json' || fileCategory === 'csv') {
      // JSON ou CSV
      content = await file.text();
      preview = content.slice(0, 300);

    } else if (fileCategory === 'pdf') {
      // PDF - Requer biblioteca (para agora, apenas aviso)
      content = `[PDF: ${file.name}] - Conteúdo PDF requer processamento especial. Use PDFjs para extrair.`;
      preview = `Arquivo PDF: ${file.name}`;

    } else if (fileCategory === 'docx') {
      // DOCX - Requer docx-parser
      content = `[DOCX: ${file.name}] - Conteúdo DOCX requer processamento especial.`;
      preview = `Arquivo Word: ${file.name}`;

    } else if (fileCategory === 'image') {
      // Imagem - Converter para base64 para preview
      const arrayBuffer = await file.arrayBuffer();
      const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
      content = `data:${type};base64,${base64}`;
      preview = `Imagem: ${file.name}`;
    }
  } catch (error) {
    throw new Error(`Erro ao processar arquivo: ${error.message}`);
  }

  return {
    name: file.name,
    type: fileCategory,
    content,
    preview: preview || content.slice(0, 200),
    size: file.size,
    mimeType: type,
    processedAt: new Date().toISOString()
  };
}

/**
 * Gera uma preview visual do arquivo para exibição
 * @param {Object} file - Arquivo processado
 * @returns {Object} - { title, icon, subtitle, isImage }
 */
export function generateFilePreview(file) {
  const iconMap = {
    text: '📄',
    pdf: '📕',
    doc: '📘',
    docx: '📘',
    xls: '📊',
    xlsx: '📊',
    csv: '📋',
    json: '{ }',
    image: '🖼️'
  };

  const icon = iconMap[file.type] || '📎';
  const isImage = file.type === 'image';

  return {
    icon,
    title: file.name,
    subtitle: formatBytes(file.size),
    isImage,
    preview: file.preview,
    mimeType: file.mimeType
  };
}

/**
 * Formata bytes para readable format
 */
export function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Validação de arquivo
 */
export function validateFile(file) {
  if (!file) {
    return { valid: false, error: 'Nenhum arquivo selecionado' };
  }

  if (file.size > 10 * 1024 * 1024) {
    return { valid: false, error: 'Arquivo muito grande (máx 10MB)' };
  }

  const allowedTypes = [
    'text/plain', 'text/markdown',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/jpeg', 'image/png', 'image/gif',
    'text/csv', 'application/json'
  ];

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: `Tipo não suportado: ${file.type}` };
  }

  return { valid: true };
}
