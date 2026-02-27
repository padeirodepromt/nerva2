/* src/utils/pranaEvents.js
   desc: Barramento de eventos para gamificação e tutorial.
*/

const listeners = new Set();

export const pranaEvents = {
    // Inscrever-se para ouvir
    subscribe: (listener) => {
        listeners.add(listener);
        return () => listeners.delete(listener);
    },

    // Disparar um evento (Ex: 'CREATE_SPARK')
    emit: (event, data) => {
        console.log(`[PRANA EVENT] ${event}`, data);
        listeners.forEach((listener) => listener(event, data));
    }
};

export const EVENTS = {
    TUTORIAL_START: 'TUTORIAL_START',
    CREATE_SPARK: 'CREATE_SPARK',     // Criou algo na Inbox
    CREATE_PROJECT: 'CREATE_PROJECT', // Criou um Projeto
    CREATE_ARTIFACT: 'CREATE_ARTIFACT', // Criou Doc ou Map
    TUTORIAL_COMPLETE: 'TUTORIAL_COMPLETE'
};