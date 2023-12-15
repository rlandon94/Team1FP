function enterMusicPlayer() {
    // Set the flag in local storage to indicate the user has visited the welcome screen
    localStorage.setItem('visitedWelcomeScreen', true);
  
    console.log('Entering the music player');
    // Redirect to the main music player screen
    window.location.href = '../index.html';
  }
  