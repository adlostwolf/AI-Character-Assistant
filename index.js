import { eventSource, event_types } from '../../../script.js';

const MODULE_NAME = 'ai_character_assistant';

let panel = null;

// List of OpenRouter image models (can be expanded)
const imageModels = [
    'openai/dall-e-3',
    'openai/dall-e-2',
    'stability-ai/stable-diffusion-xl-1024-v1-0',
    'stability-ai/sdxl-1.0',
    'midjourney/midjourney',
    // Add more as needed
];

function init() {
    eventSource.on(event_types.APP_READY, () => {
        addPanel();
    });
}

function addPanel() {
    const container = document.querySelector('#extensions_settings');
    if (!container) return;

    panel = document.createElement('div');
    panel.className = 'ai-char-assistant-panel';
    panel.innerHTML = `
        <h3>AI Character Assistant</h3>
        <div class="ai-char-field">
            <label for="char-name">Name:</label>
            <input type="text" id="char-name" placeholder="Character name">
        </div>
        <div class="ai-char-field">
            <label for="char-description">Description:</label>
            <textarea id="char-description" rows="3" placeholder="Brief description"></textarea>
            <button onclick="aiFill('description')">AI Fill</button>
            <button onclick="aiImprove('description')">AI Improve</button>
        </div>
        <div class="ai-char-field">
            <label for="char-personality">Personality:</label>
            <textarea id="char-personality" rows="5" placeholder="Personality traits"></textarea>
            <button onclick="aiFill('personality')">AI Fill</button>
            <button onclick="aiImprove('personality')">AI Improve</button>
        </div>
        <div class="ai-char-field">
            <label for="char-scenario">Scenario:</label>
            <textarea id="char-scenario" rows="3" placeholder="Starting scenario"></textarea>
            <button onclick="aiFill('scenario')">AI Fill</button>
            <button onclick="aiImprove('scenario')">AI Improve</button>
        </div>
        <div class="ai-char-field">
            <label for="char-first-mes">First Message:</label>
            <textarea id="char-first-mes" rows="3" placeholder="First message from character"></textarea>
            <button onclick="aiFill('first_mes')">AI Fill</button>
            <button onclick="aiImprove('first_mes')">AI Improve</button>
        </div>
        <div class="ai-char-field">
            <label for="char-mes-example">Message Example:</label>
            <textarea id="char-mes-example" rows="5" placeholder="Example dialogue"></textarea>
            <button onclick="aiFill('mes_example')">AI Fill</button>
            <button onclick="aiImprove('mes_example')">AI Improve</button>
        </div>
        <div class="ai-char-field">
            <label for="char-tags">Tags:</label>
            <input type="text" id="char-tags" placeholder="Comma-separated tags">
            <button onclick="aiFill('tags')">AI Suggest Tags</button>
        </div>
        <div class="ai-char-export">
            <button onclick="exportCharacter()">Export Character</button>
        </div>
    `;

    container.appendChild(panel);

    // Make functions global for onclick
    // @ts-ignore
    window.aiFill = aiFill;
    // @ts-ignore
    window.aiImprove = aiImprove;
    // @ts-ignore
    window.exportCharacter = exportCharacter;
}

async function aiFill(field) {
    // @ts-ignore
    const name = document.getElementById('char-name').value;
    // @ts-ignore
    const currentValue = document.getElementById(`char-${field}`).value;

    let prompt = '';
    switch (field) {
        case 'description':
            prompt = `Generate a brief description for a character named ${name}. ${currentValue ? 'Incorporate: ' + currentValue : ''}`;
            break;
        case 'personality':
            prompt = `Generate a detailed personality description for a character named ${name}. ${currentValue ? 'Include traits: ' + currentValue : ''}`;
            break;
        case 'scenario':
            prompt = `Generate a starting scenario for a roleplay with a character named ${name}. ${currentValue ? 'Based on: ' + currentValue : ''}`;
            break;
        case 'first_mes':
            prompt = `Generate the first message from a character named ${name} in a roleplay. ${currentValue ? 'Incorporate: ' + currentValue : ''}`;
            break;
        case 'mes_example':
            prompt = `Generate example dialogue for a character named ${name}. ${currentValue ? 'Include style: ' + currentValue : ''}`;
            break;
        case 'tags':
            prompt = `Suggest comma-separated tags for a character named ${name}. ${currentValue ? 'Include: ' + currentValue : ''}`;
            break;
    }

    try {
        const result = await SillyTavern.getContext().generateRaw({
            prompt: prompt,
            systemPrompt: 'You are a creative AI assistant helping to create character cards for roleplaying.'
        });
        // @ts-ignore
        document.getElementById(`char-${field}`).value = result;
    } catch (error) {
        console.error('AI generation failed:', error);
        alert('AI generation failed. Check your API connection.');
    }
}

async function aiImprove(field) {
    // @ts-ignore
    const name = document.getElementById('char-name').value;
    // @ts-ignore
    const currentValue = document.getElementById(`char-${field}`).value;

    if (!currentValue) {
        alert('Please enter some text to improve.');
        return;
    }

    let prompt = '';
    switch (field) {
        case 'description':
            prompt = `Improve and expand this description for a character named ${name}: "${currentValue}". Make it more detailed and engaging.`;
            break;
        case 'personality':
            prompt = `Improve and expand this personality description for a character named ${name}: "${currentValue}". Make it more detailed and engaging.`;
            break;
        case 'scenario':
            prompt = `Improve and expand this scenario for a character named ${name}: "${currentValue}". Make it more detailed and engaging.`;
            break;
        case 'first_mes':
            prompt = `Improve and expand this first message for a character named ${name}: "${currentValue}". Make it more detailed and engaging.`;
            break;
        case 'mes_example':
            prompt = `Improve and expand this example dialogue for a character named ${name}: "${currentValue}". Make it more detailed and engaging.`;
            break;
        case 'tags':
            prompt = `Improve and expand these tags for a character named ${name}: "${currentValue}". Suggest more relevant comma-separated tags.`;
            break;
    }

    try {
        const result = await SillyTavern.getContext().generateRaw({
            prompt: prompt,
            systemPrompt: 'You are a creative AI assistant helping to refine character cards for roleplaying.'
        });
        // @ts-ignore
        document.getElementById(`char-${field}`).value = result;
    } catch (error) {
        console.error('AI improvement failed:', error);
        alert('AI improvement failed. Check your API connection.');
    }
}

function exportCharacter() {
    const character = {
        name: '',
        description: '',
        personality: '',
        scenario: '',
        first_mes: '',
        mes_example: '',
        creatorcomment: '',
        avatar: 'none',
        chat: '',
        folder: '',
        tags: '',
        alternate_greetings: [],
        character_book: null,
        spec: 'chara_card_v2',
        spec_version: '2.0',
        data: {
            name: '',
            description: '',
            personality: '',
            scenario: '',
            first_mes: '',
            mes_example: '',
            creatorcomment: '',
            avatar: 'none',
            chat: '',
            folder: '',
            tags: '',
            alternate_greetings: [],
            character_book: null,
            extensions: {}
        }
    };

    // @ts-ignore
    character.name = document.getElementById('char-name').value;
    character.data.name = character.name;
    // @ts-ignore
    character.data.description = document.getElementById('char-description').value;
    // @ts-ignore
    character.data.personality = document.getElementById('char-personality').value;
    // @ts-ignore
    character.data.scenario = document.getElementById('char-scenario').value;
    // @ts-ignore
    character.data.first_mes = document.getElementById('char-first-mes').value;
    // @ts-ignore
    character.data.mes_example = document.getElementById('char-mes-example').value;
    // @ts-ignore
    character.data.tags = document.getElementById('char-tags').value;

    const dataStr = JSON.stringify(character, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${character.name || 'character'}.json`;
    link.click();

    URL.revokeObjectURL(url);
}

init();