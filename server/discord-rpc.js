const DiscordRPC = require('discord-rpc');

const clientId = '1506675501400457377'; 

try {
  DiscordRPC.register(clientId);
} catch (error) {
  // Catch errors in case Discord isn't running or register fails
  console.log("Could not register Discord RPC:", error);
}

const rpc = new DiscordRPC.Client({ transport: 'ipc' });
const startTimestamp = new Date();

let isReady = false;

rpc.on('ready', () => {
  console.log('Discord Rich Presence is active!');
  isReady = true;

  rpc.setActivity({
    details: 'Exploring Nexus',
    state: 'Navigating',
    startTimestamp,
    largeImageKey: 'nexuss', // Fallback, works if you uploaded an image called nexus_logo
    largeImageText: 'Nexus App',
    instance: false,
  }).catch(console.error);
});

// Authenticate and connect
rpc.login({ clientId }).catch(console.error);

function updatePresence(details, state) {
  if (!isReady) return;
  
  rpc.setActivity({
    details: details || 'Exploring Nexus',
    state: state || 'Studying & Grinding',
    startTimestamp,
    largeImageKey: 'nexuss',
    largeImageText: 'Nexus App',
    instance: false,
  }).catch(console.error);
}

module.exports = {
  updatePresence
};
