/* src/utils/csvParser.js
   desc: Utilitário robusto para ler CSVs sem bibliotecas externas.
   feat: Suporta aspas, quebras de linha e separadores dinâmicos (, ou ;).
*/

export const parseCSV = (text) => {
    // 1. Detectar Separador (, ou ;)
    const separators = [',', ';', '\t'];
    const separator = separators.find(s => text.indexOf(s) > -1) || ',';

    // 2. Tokenizer (Máquina de Estados para lidar com aspas)
    const rows = [];
    let currentRow = [];
    let currentVal = '';
    let insideQuote = false;

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const nextChar = text[i + 1];

        if (char === '"') {
            if (insideQuote && nextChar === '"') {
                currentVal += '"'; // Aspas duplas escapadas ("")
                i++;
            } else {
                insideQuote = !insideQuote;
            }
        } else if (char === separator && !insideQuote) {
            currentRow.push(currentVal.trim());
            currentVal = '';
        } else if ((char === '\n' || char === '\r') && !insideQuote) {
            if (currentVal || currentRow.length > 0) {
                currentRow.push(currentVal.trim());
                rows.push(currentRow);
            }
            currentRow = [];
            currentVal = '';
            // Pula \n extra se for \r\n
            if (char === '\r' && nextChar === '\n') i++;
        } else {
            currentVal += char;
        }
    }
    // Adiciona última linha se existir
    if (currentVal || currentRow.length > 0) {
        currentRow.push(currentVal.trim());
        rows.push(currentRow);
    }

    // 3. Converter para JSON (Headers + Rows)
    const headers = rows[0].map(h => h.replace(/^['"]|['"]$/g, '').trim()); // Remove aspas extras
    const data = rows.slice(1).map(row => {
        const obj = {};
        headers.forEach((header, index) => {
            obj[header] = row[index] || '';
        });
        return obj;
    });

    return { headers, data };
};