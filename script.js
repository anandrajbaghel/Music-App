'use strict';

document.addEventListener("DOMContentLoaded", function() {
    const searchResults = document.getElementById('search-results');
    const searchListSongs = document.getElementById('search-list-songs');
    const searchListArtists = document.getElementById('search-list-artists');
    const searchInput = document.getElementById('search-bar');

    const audioPlayer = document.getElementById('audio-player');
    const playPauseButton = document.getElementById('play-pause');
    const previousButton = document.getElementById('previous');
    const nextButton = document.getElementById('next');
    const repeat = document.getElementById('repeat');
    const shuffle = document.getElementById('shuffle');
    const fullscreenButton = document.getElementById('fullscreen'); // Added fullscreen button reference
    
    const statusHead = document.querySelector('.statusHead');
    const statusTail = document.querySelector('.statusTail');
    const counterCount = document.querySelector('.counterCount');
    const counterTotalCount = document.querySelector('.counterTotalCount');
    const statusProgress = document.querySelector('.statusProgress');

    // Specific card selectors for updating song details
    const card_0 = document.querySelector('.card-0');
    const card_1 = document.querySelector('.card-1');
    const card_2 = document.querySelector('.card-2');
    const card_3 = document.querySelector('.card-3');
    const card_4 = document.querySelector('.card-4');
    const card_0_song = document.querySelector('.card-0 .mainName');
    const card_1_song = document.querySelector('.card-1 .mainName');
    const card_2_song = document.querySelector('.card-2 .mainName');
    const card_3_song = document.querySelector('.card-3 .mainName');
    const card_4_song = document.querySelector('.card-4 .mainName');
    const card_0_artist = document.querySelector('.card-0 .artistName');
    const card_1_artist = document.querySelector('.card-1 .artistName');
    const card_2_artist = document.querySelector('.card-2 .artistName');
    const card_3_artist = document.querySelector('.card-3 .artistName');
    const card_4_artist = document.querySelector('.card-4 .artistName');
    const card_0_image = document.querySelector('.card-0 .cardImage');
    const card_1_image = document.querySelector('.card-1 .cardImage');
    const card_2_image = document.querySelector('.card-2 .cardImage');
    const card_3_image = document.querySelector('.card-3 .cardImage');
    const card_4_image = document.querySelector('.card-4 .cardImage');

    card_0_song.textContent = 'High On Life';
    card_1_song.textContent = 'Ilahi';
    card_2_song.textContent = 'No Sleep';
    card_3_song.textContent = 'On & On';
    card_4_song.textContent = 'Shanivaar Raati';
    card_0_artist.textContent = 'Martin Garrix';
    card_1_artist.textContent = 'Arijit Singh';
    card_2_artist.textContent = 'Martin Garrix';
    card_3_artist.textContent = 'Cartoon';
    card_4_artist.textContent = 'Arijit Singh';

    let isPlaying = false;
    let currentSongIndex = 2; // Starting with the third song (index 2)
    const songs = ['High On Life.mp3', 'Ilahi.mp3', 'No Sleep.mp3', 'On & On.mp3', 'Shanivaar Raati.mp3']; // Add your song filenames here
    const artistNames = ['Martin Garrix', 'Arijit Singh', 'Martin Garrix', 'Cartoon', 'Arijit Singh']; // Add artist names here
    const songImages = ['r/image1.jpg', 'r/image2.jpg', 'r/image3.jpg', 'r/image4.jpg', 'r/image5.jpg']; // Add image paths here

    let repeatMode = 'all'; // 'none', 'one', 'all'

    function playPause() {
        if (!isPlaying) {
            audioPlayer.play();
            playPauseButton.innerHTML = '<img src="r/pause.svg" alt="" srcset="">';
            isPlaying = true;
        } else {
            audioPlayer.pause();
            playPauseButton.innerHTML = '<img src="r/play.svg" alt="" srcset="">'; // Replace with pause icon path
            isPlaying = false;
        }
    }

    function playNextSong() {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        audioPlayer.src = songs[currentSongIndex];
        audioPlayer.play();
        updateUI();
    }

    function nextSong() {
        playNextSong();
    }

    function previousSong() {
        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        audioPlayer.src = songs[currentSongIndex];
        audioPlayer.play();
        updateUI();
    }

    function updateUI() {
        // Update song details
        const songName = document.querySelector('.card-2 .mainName');
        const artistName = document.querySelector('.card-2 .artistName');
        const cardImage = document.querySelector('.card-2 .cardImage');

        // Replace with actual song details
        const currentSong = songs[currentSongIndex];
        songName.textContent = currentSong.substring(0, currentSong.lastIndexOf('.')); // Extracting the song name without the file extension

        // For artist name and image, you can customize or use placeholders as needed
        artistName.textContent = artistNames[currentSongIndex]; // Replace with actual artist name
        cardImage.src = songImages[currentSongIndex];
        card_0_image.src = songImages[(currentSongIndex + 3) % songs.length];
        card_1_image.src = songImages[(currentSongIndex + 4) % songs.length];
        card_3_image.src = songImages[(currentSongIndex + 1) % songs.length];
        card_4_image.src = songImages[(currentSongIndex + 2) % songs.length];

        card_0_song.textContent = songs[(currentSongIndex + 3) % songs.length].substring(0, songs[(currentSongIndex + 3) % songs.length].lastIndexOf('.'));
        card_1_song.textContent = songs[(currentSongIndex + 4) % songs.length].substring(0, songs[(currentSongIndex + 4) % songs.length].lastIndexOf('.'));
        card_3_song.textContent = songs[(currentSongIndex + 1) % songs.length].substring(0, songs[(currentSongIndex + 1) % songs.length].lastIndexOf('.'));
        card_4_song.textContent = songs[(currentSongIndex + 2) % songs.length].substring(0, songs[(currentSongIndex + 2) % songs.length].lastIndexOf('.'));

        card_0_artist.textContent = artistNames[(currentSongIndex + 3) % songs.length];
        card_1_artist.textContent = artistNames[(currentSongIndex + 4) % songs.length];
        card_3_artist.textContent = artistNames[(currentSongIndex + 1) % songs.length];
        card_4_artist.textContent = artistNames[(currentSongIndex + 2) % songs.length];

        // Reset progress bar
        statusHead.style.left = '0px';
        statusTail.style.width = '0%';
        counterCount.textContent = '00:00'; // Reset to start time
        counterTotalCount.textContent = '00:00'; // Replace with actual total time
    }

    playPauseButton.addEventListener('click', playPause);
    nextButton.addEventListener('click', nextSong);
    previousButton.addEventListener('click', previousSong);

    // Progress bar update
    audioPlayer.addEventListener('timeupdate', function() {
        const currentTime = audioPlayer.currentTime;
        const duration = audioPlayer.duration;
        const progress = (currentTime / duration) * 100;

        statusHead.style.left = progress + '%';
        statusTail.style.width = progress + '%';

        // Update current time display
        const minutes = Math.floor(currentTime / 60);
        const seconds = Math.floor(currentTime % 60);
        counterCount.textContent = (minutes < 10 ? '0' : '') + minutes + ':' + (seconds < 10 ? '0' : '') + seconds;

        // Update total duration display
        const totalMinutes = Math.floor(duration / 60);
        const totalSeconds = Math.floor(duration % 60);
        counterTotalCount.textContent = (totalMinutes < 10 ? '0' : '') + totalMinutes + ':' + (totalSeconds < 10 ? '0' : '') + totalSeconds;
    });

    // Initialize with the first song
    audioPlayer.src = songs[currentSongIndex];

    // Auto play next song when current song ends
    audioPlayer.addEventListener('ended', function() {
        if (repeatMode === 'one') {
            audioPlayer.src = songs[currentSongIndex];
            audioPlayer.play();
        } else if (repeatMode === 'all') {
            playNextSong();
        }
    });

    // Handle draggable status bar
    statusProgress.addEventListener('mousedown', function(e) {
        const rect = statusProgress.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const newProgress = (offsetX / rect.width) * 100;

        // Update audio player current time
        const newTime = (newProgress / 100) * audioPlayer.duration;
        audioPlayer.currentTime = newTime;

        // Update UI
        statusHead.style.left = newProgress + '%';
        statusTail.style.width = newProgress + '%';
    });

    // Spacebar play/pause functionality
    document.addEventListener('keydown', function(e) {
        if (e.code === 'Space' && document.activeElement !== document.getElementById('search-bar')) {
            e.preventDefault(); // Prevent scrolling the page down
            playPause();
        } else if (e.code === 'ArrowRight' && document.activeElement !== document.getElementById('search-bar')) {
            // Seek forward 10 seconds
            audioPlayer.currentTime += 10;
        } else if (e.code === 'ArrowLeft' && document.activeElement !== document.getElementById('search-bar')) {
            // Seek backward 10 seconds
            audioPlayer.currentTime -= 10;
        } else if (e.code === 'KeyN' && document.activeElement !== document.getElementById('search-bar')) {
            // Play next song
            playNextSong();
        } else if (e.code === 'KeyP' && document.activeElement !== document.getElementById('search-bar')) {
            // Play previous song
            previousSong();
        } else if (e.code === 'KeyF' && document.activeElement !== document.getElementById('search-bar')) {
            // Activate the search bar
            e.preventDefault(); // Prevent the 'f' key from being entered into the search bar
            searchInput.focus();
        } else if (e.code === 'KeyS' && document.activeElement !== document.getElementById('search-bar')) {
            // Toggle fullscreen mode
            e.preventDefault(); // Prevent the 's' key from being entered into the search bar
            toggleFullscreen();
        }
    });

    // Fullscreen functionality when key pressed "S"
    function toggleFullscreen() {
        if (document.fullscreenElement) {
            document.exitFullscreen();
            card_0.style.left = 'calc(50% - 360px)';
            card_1.style.left = 'calc(50% - 200px)';
            card_3.style.left = 'calc(50% + 130px)';
            card_4.style.left = 'calc(50% + 250px)';

            card_2.style.left = '50%';
            card_2.style.scale = '1';
            fullscreenButton.innerHTML = '<img src="r/fullscreen.svg" alt="" srcset="">';
        } else {
            document.documentElement.requestFullscreen().catch(err => {
                console.log(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
            card_0.style.left = '180px';
            card_1.style.left = '190px';
            card_3.style.left = '190px';
            card_4.style.left = '180px';

            card_2.style.left = '200px';
            card_2.style.scale = '1.05';
            fullscreenButton.innerHTML = '<img src="r/exit-fullscreen.svg" alt="" srcset="">';
        }
    }

    // Fullscreen functionality
    fullscreenButton.addEventListener('click', function() {
        if (document.fullscreenElement) {
            document.exitFullscreen();
            card_0.style.left = 'calc(50% - 360px)';
            card_1.style.left = 'calc(50% - 200px)';
            card_3.style.left = 'calc(50% + 130px)';
            card_4.style.left = 'calc(50% + 250px)';

            card_2.style.left = '50%';
            card_2.style.scale = '1';
            fullscreenButton.innerHTML = '<img src="r/fullscreen.svg" alt="" srcset="">';
        } else {
            document.documentElement.requestFullscreen().catch(err => {
                console.log(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
            card_0.style.left = '180px';
            card_1.style.left = '190px';
            card_3.style.left = '190px';
            card_4.style.left = '180px';

            card_2.style.left = '200px';
            card_2.style.scale = '1.05';
            fullscreenButton.innerHTML = '<img src="r/exit-fullscreen.svg" alt="" srcset="">';
        }
    });

    // Dynamic search functionality
    searchInput.addEventListener('input', function() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        filterSongs(searchTerm);
    });

    function filterSongs(searchTerm) {
        searchTerm = searchTerm.trim(); // Trim whitespace from search term
    
        // Clear previous results
        searchListSongs.innerHTML = '';
        searchListArtists.innerHTML = '';
    
        // Arrays to store matched songs and unique artists
        let matchedSongs = [];
        let uniqueArtists = [];
    
        // Filter songs based on search term
        songs.forEach((song, index) => {
            const songName = song.substring(0, song.lastIndexOf('.'));
            const artistName = artistNames[index];
    
            if (songName.toLowerCase().includes(searchTerm.toLowerCase())) {
                matchedSongs.push({ index, songName, artistName });
            }
        });
    
        // Filter unique artists based on search term
        artistNames.forEach((artist, index) => {
            if (artist.toLowerCase().includes(searchTerm.toLowerCase()) && !uniqueArtists.includes(artist)) {
                uniqueArtists.push(artist);
            }
        });
    
        // Display matched songs in ordered list
        matchedSongs.forEach((songObj, count) => {
            const { index, songName, artistName } = songObj;
            const songListItem = document.createElement('li');
            songListItem.textContent = `${count + 1}. ${songName} - ${artistName}`;
            songListItem.addEventListener('click', function() {
                currentSongIndex = index;
                audioPlayer.src = songs[currentSongIndex];
                audioPlayer.play();
                updateUI();
            });
            searchListSongs.appendChild(songListItem);
        });
    
        // Display unique artists in ordered list
        uniqueArtists.forEach((artist, count) => {
            const artistListItem = document.createElement('li');
            artistListItem.textContent = `${count + 1}. ${artist}`;
            searchListArtists.appendChild(artistListItem);
        });
    }   
    // Add event listeners to show searchResults
    searchInput.addEventListener('focus', function() {
        searchResults.style.display = 'block';
    });
    searchResults.addEventListener('mouseenter', function() {
        searchResults.style.display = 'block';
    });
    searchResults.addEventListener('mouseover', function() {
        searchResults.style.display = 'block';
    });
    document.addEventListener('click', function(e) {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.style.display = 'none';
        }
    });

    // Add event listener to Repeat button
    repeat.addEventListener('click', function() {
        switch (repeatMode) {
            case 'all':
                repeatMode = 'one';
                repeat.innerHTML = '<img src="r/repeat-one.svg" alt="" srcset="">'; // Update to your repeat-all icon path
                break;
            case 'one':
                repeatMode = 'none';
                repeat.innerHTML = '<img src="r/no-repeat.svg" alt="" srcset="">'; // Update to your repeat-one icon path
                break;
            case 'none':
                repeatMode = 'all';
                repeat.innerHTML = '<img src="r/repeat-all.svg" alt="" srcset="">'; // Update to your repeat icon path
                break;
        }
    });
});
