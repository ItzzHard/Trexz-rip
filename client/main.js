import { DiscordSDK } from "@discord/embedded-app-sdk";

import rocketLogo from "/rocket.png";
import "./style.css";

// Will eventually store the authenticated user's access_token
let auth;
// Counter for button clicks
let workCount = 0;
// Timer for resetting counter
let resetTimer = null;
// Store connected users
let connectedUsers = new Map();

const discordSdk = new DiscordSDK(import.meta.env.VITE_DISCORD_CLIENT_ID);

// Create and add the user profile to top left
async function createUserProfile() {
  // Get user information from Discord API
  const user = await fetch(`https://discord.com/api/v10/users/@me`, {
    headers: {
      Authorization: `Bearer ${auth.access_token}`,
      "Content-Type": "application/json",
    },
  }).then((response) => response.json());

  // Create profile container
  const profileContainer = document.createElement("div");
  profileContainer.className = "profile-container user-profile";

  // Avatar image
  const avatarImg = document.createElement("img");
  avatarImg.className = "profile-avatar";
  // Format the avatar URL properly
  const avatarUrl = user.avatar
    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp?size=80`
    : "https://cdn.discordapp.com/embed/avatars/0.png"; // Default avatar
  avatarImg.src = avatarUrl;

  // Username display
  const username = document.createElement("span");
  username.className = "profile-name";
  username.textContent = user.username || "Discord User";

  profileContainer.appendChild(avatarImg);
  profileContainer.appendChild(username);

  document.body.appendChild(profileContainer);

  // Store the current user in our connected users
  connectedUsers.set(user.id, {
    id: user.id,
    username: user.username,
    avatar: avatarUrl,
  });
}

// Create and add the server profile to top right
async function createServerProfile() {
  // Only proceed if we have guild info
  if (!discordSdk.guildId) return;

  // Get guild information
  const guilds = await fetch(`https://discord.com/api/v10/users/@me/guilds`, {
    headers: {
      Authorization: `Bearer ${auth.access_token}`,
      "Content-Type": "application/json",
    },
  }).then((response) => response.json());

  const currentGuild = guilds.find((g) => g.id === discordSdk.guildId);

  if (!currentGuild) return;

  // Create server profile container
  const serverContainer = document.createElement("div");
  serverContainer.className = "profile-container server-profile";

  // Server icon
  const serverImg = document.createElement("img");
  serverImg.className = "profile-avatar";
  const serverIconUrl = currentGuild.icon
    ? `https://cdn.discordapp.com/icons/${currentGuild.id}/${currentGuild.icon}.webp?size=80`
    : "https://cdn.discordapp.com/embed/avatars/0.png"; // Default icon
  serverImg.src = serverIconUrl;

  // Server name
  const serverName = document.createElement("span");
  serverName.className = "profile-name";
  serverName.textContent = currentGuild.name;

  serverContainer.appendChild(serverImg);
  serverContainer.appendChild(serverName);

  document.body.appendChild(serverContainer);
}

// Create the VC users bar at the top (desktop only)
function createVCUsersBar() {
  // Create the VC users bar
  const vcUsersBar = document.createElement("div");
  vcUsersBar.id = "vc-users-bar";
  vcUsersBar.className = "vc-users-bar";

  // Add title
  const barTitle = document.createElement("span");
  barTitle.className = "vc-bar-title";
  barTitle.textContent = "In Voice Channel:";
  vcUsersBar.appendChild(barTitle);

  // Add users container
  const usersContainer = document.createElement("div");
  usersContainer.className = "vc-users-container";
  usersContainer.id = "vc-users-container";
  vcUsersBar.appendChild(usersContainer);

  document.body.appendChild(vcUsersBar);

  // Add current user to the VC bar
  updateVCUsers();
}

// Update the VC users bar with connected users
function updateVCUsers() {
  const container = document.getElementById("vc-users-container");
  if (!container) return;

  // Clear existing content
  container.innerHTML = "";

  // Add each user
  connectedUsers.forEach((user) => {
    const userIcon = document.createElement("div");
    userIcon.className = "vc-user-icon";
    userIcon.title = user.username;

    const userAvatar = document.createElement("img");
    userAvatar.src = user.avatar;
    userAvatar.alt = user.username;

    userIcon.appendChild(userAvatar);
    container.appendChild(userIcon);
  });
}

// Simulate different users joining the VC (for demo purposes)
// In a real application, this would be handled by events from Discord
function simulateUsersJoining() {
  if (!discordSdk.guildId) return;

  // Demo user data - in real application this would come from Discord events
  const demoUsers = [
    {
      id: "user1",
      username: "CoolUser",
      avatar: "https://cdn.discordapp.com/embed/avatars/1.png",
    },
    {
      id: "user2",
      username: "GamerPro",
      avatar: "https://cdn.discordapp.com/embed/avatars/2.png",
    },
    {
      id: "user3",
      username: "DiscordFan",
      avatar: "https://cdn.discordapp.com/embed/avatars/3.png",
    },
  ];

  // Add a new user every few seconds
  let userIndex = 0;

  const addUser = () => {
    if (userIndex < demoUsers.length) {
      const user = demoUsers[userIndex];
      connectedUsers.set(user.id, user);
      updateVCUsers();
      userIndex++;

      // Only on desktop
      if (window.innerWidth > 768) {
        // Show notification
        showNotification(`${user.username} joined the voice channel`);
      }

      setTimeout(addUser, 5000); // Add another user after 5 seconds
    }
  };

  // Start the simulation after a delay
  setTimeout(addUser, 3000);
}

// Show a notification when a user joins
function showNotification(message) {
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.textContent = message;

  document.body.appendChild(notification);

  // Fade out and remove after animation
  setTimeout(() => {
    notification.classList.add("fadeout");
    setTimeout(() => notification.remove(), 500);
  }, 3000);
}

// Create the main content area
function createMainContent() {
  const app = document.querySelector("#app");
  app.innerHTML = "";

  // Create main container
  const mainContainer = document.createElement("div");
  mainContainer.className = "main-container";

  // Logo and title
  const logoContainer = document.createElement("div");
  logoContainer.className = "logo-container";

  const logo = document.createElement("img");
  logo.src = rocketLogo;
  logo.className = "logo animated";
  logo.alt = "Bot Logo";

  const title = document.createElement("h2");
  title.className = "coming-soon neon-text";
  title.textContent = "Coming Soon";

  logoContainer.appendChild(logo);
  logoContainer.appendChild(title);

  // Counter section
  const counterSection = document.createElement("div");
  counterSection.className = "counter-section";

  const counterButton = document.createElement("button");
  counterButton.id = "counter-button";
  counterButton.className = "neon-button";
  counterButton.innerHTML = `Clicks: <span id="counter-value">0</span>`;

  // Add click event
  counterButton.addEventListener("click", () => {
    workCount++;
    document.getElementById("counter-value").textContent = workCount;

    // Reset counter after 2 seconds of inactivity
    if (resetTimer) clearTimeout(resetTimer);

    resetTimer = setTimeout(() => {
      workCount = 0;
      document.getElementById("counter-value").textContent = "0";

      // Add reset animation
      const counterValue = document.getElementById("counter-value");
      counterValue.classList.add("reset");
      setTimeout(() => counterValue.classList.remove("reset"), 500);
    }, 2000);

    // Add animation
    counterButton.classList.add("pulse");
    setTimeout(() => counterButton.classList.remove("pulse"), 300);
  });

  counterSection.appendChild(counterButton);

  // Assemble main container
  mainContainer.appendChild(logoContainer);
  mainContainer.appendChild(counterSection);

  app.appendChild(mainContainer);
}

// Adjust layout based on screen size
function adjustLayout() {
  const isMobile = window.innerWidth <= 768;
  document.body.classList.toggle("mobile", isMobile);
  document.body.classList.toggle("desktop", !isMobile);

  const vcBar = document.getElementById("vc-users-bar");
  if (vcBar) {
    vcBar.style.display = isMobile ? "none" : "flex";
  }
}

// Initialize everything
setupDiscordSdk().then(async () => {
  console.log("Discord SDK is authenticated");

  // Create the layout
  await createUserProfile();
  await createServerProfile();
  createMainContent();

  // Only create VC users bar on desktop
  if (window.innerWidth > 768) {
    createVCUsersBar();
    // Start the simulation
    simulateUsersJoining();
  }

  // Add window resize handler
  window.addEventListener("resize", adjustLayout);
  adjustLayout();

  // Add animations
  const animatedElements = document.querySelectorAll(
    ".logo, .neon-text, .neon-button, .profile-container"
  );
  animatedElements.forEach((element, index) => {
    setTimeout(() => {
      element.classList.add("visible");
    }, index * 150);
  });
});

async function setupDiscordSdk() {
  await discordSdk.ready();
  console.log("Discord SDK is ready");

  // Authorize with Discord Client
  const { code } = await discordSdk.commands.authorize({
    client_id: import.meta.env.VITE_DISCORD_CLIENT_ID,
    response_type: "code",
    state: "",
    prompt: "none",
    scope: ["identify", "guilds", "applications.commands"],
  });

  // Retrieve an access_token from your activity's server
  try {
    const response = await fetch("/.proxy/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response:", errorText);
      throw new Error(`Request failed: ${response.status}`);
    }

    const data = await response.json();
    console.log("Token exchange successful");

    // Authenticate with Discord client (using the access_token)
    auth = await discordSdk.commands.authenticate({
      access_token: data.access_token,
    });

    if (auth == null) {
      throw new Error("Authenticate command failed");
    }

    return auth;
  } catch (error) {
    console.error("Error during authentication:", error);
    throw error;
  }
}
