import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const config: BotConfig = {
    token: process.env.DISCORD_TOKEN || '',
    clientId: process.env.CLIENT_ID || '',
    mongoUri: process.env.MONGO_URI || '',
    defaultPrefix: '!',
    mainGuildId: process.env.MAIN_GUILD_ID || '',
    defaultLanguage: 'en',        // default language
   dashboard: {
    port: Number(process.env.PORT || 3000),
secret: process.env.DASHBOARD_SECRET || '',
callbackUrl: 'https://bot-mory.fadehost.app/auth/callback'
    }
};


export interface BotConfig {
    token: string;
    clientId: string;
    mongoUri: string;
    defaultPrefix: string;
    mainGuildId: string;
    defaultLanguage: string;
    dashboard: {
        port: number;
        secret: string;
        callbackUrl: string;
    };
}

function loadSettingsFile(): any {
    let settingsPath = join(__dirname, 'settings.json');
    
    if (!existsSync(settingsPath)) {
        settingsPath = join(__dirname, '../settings.json');
        
        if (!existsSync(settingsPath)) {
            settingsPath = join(process.cwd(), 'settings.json');
            
            if (!existsSync(settingsPath)) {
                const defaultSettings = {
                    defaultLanguage: "en",
                    logs: {},
                    protection: {
                        enabled: true,
                        modules: {}
                    }
                };
                
                writeFileSync(settingsPath, JSON.stringify(defaultSettings, null, 4), 'utf8');
                console.log(`Created default settings file at ${settingsPath}`);
                return defaultSettings;
            }
        }
    }
    
    try {
        console.log(`Loading settings from: ${settingsPath}`);
        const settings = JSON.parse(readFileSync(settingsPath, 'utf-8'));
        return settings;
    } catch (error) {
        console.error(`Error reading settings file: ${error}`);
        throw new Error('Failed to load settings.json file');
    }
}
const settings = loadSettingsFile();

export default {
    ...config,
    ...settings,
    token: config.token,
    clientId: config.clientId,
    mongoUri: config.mongoUri,
    defaultPrefix: config.defaultPrefix,
    mainGuildId: config.mainGuildId,
    dashboard: config.dashboard
}; 
