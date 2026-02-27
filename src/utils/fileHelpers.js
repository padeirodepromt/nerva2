/* src/utils/fileHelpers.js
   desc: Extrator de conteúdo local. Lê arquivos para alimentar o Ash.
*/

export const readFileContent = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      resolve(event.target.result);
    };

    reader.onerror = (error) => {
      reject(error);
    };

    // Para MVP, focamos em arquivos de texto. 
    // Futuramente, aqui entraria o pdf.js para ler PDFs.
    if (file.type === "application/pdf") {
       // Placeholder para PDF (exigiria biblioteca pesada)
       // Por enquanto, salvamos apenas o nome e um aviso.
       resolve(`[Conteúdo PDF binário não extraído via navegador: ${file.name}]`);
    } else if (file.type.startsWith("image/")) {
       resolve(`[Imagem anexada: ${file.name}]`);
    } else {
       // Tenta ler como texto (md, txt, json, csv, js, code)
       reader.readAsText(file);
    }
  });
};