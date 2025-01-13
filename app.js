// app.js
'use strict';

// Importing entities from songs.js
import { Song, songs, addSong, searchSongs, fetchLyrics } from './song.js';

function updateFavicon() {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const favicon = document.getElementById('favicon');

    if (darkModeMediaQuery.matches) {
        favicon.href = 'r/spreadMusic.svg';
    } else {
        favicon.href = 'r/spreadMusic-dark.svg';
    }
}
updateFavicon();
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateFavicon);


document.addEventListener("DOMContentLoaded", async function() {
    
    const main = document.getElementById('main');
    const queue = document.getElementById('left-side-queue');
    const queueList = document.getElementById('queue-list');
    const audioPlayer = document.getElementById('audio-player');
    const playingSongQueue = document.querySelector('.playingSongQueue');
    const like = document.getElementById('like');
    const repeat = document.getElementById('repeat');
    const previous = document.getElementById('previous');
    const playPause = document.getElementById('play-pause');
    const next = document.getElementById('next');
    const shuffle = document.getElementById('shuffle');
    const volumeIcon = document.getElementById('volume-icon');
    const fullscreen = document.getElementById('fullscreen');
    const lyricsDisplay = document.getElementById('lyrics-display');
    const searchInput = document.getElementById('search-bar');
    const searchResults = document.getElementById('search-results');
    const searchListSongs = document.getElementById('search-list-songs');
    const searchListArtists = document.getElementById('search-list-artists');
    const statusProgress = document.querySelector('.statusProgress');
    const statusTail = document.querySelector('.statusTail');
    const statusHead = document.querySelector('.statusHead');
    const counterCount = document.querySelector('.counterCount');
    const counterTotalCount = document.querySelector('.counterTotalCount');
    const statusVolume = document.querySelector('.statusVolume');
    const volumeProgress = document.querySelector('.volumeProgress');
    const volumeTail = document.querySelector('.volumeTail');
    const volumeHead = document.querySelector('.volumeHead');
    const profile = document.querySelector('.profile');
    const profileMsg = document.querySelector('.profileMsg');
    const welcomeMsg = document.querySelector('.welcomeMsg');

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

    // Fetch JSON data and populate songs array
    await fetchSongs(); // Call the async function to fetch songs
    async function fetchSongs() {
        try {
            const response = await fetch('songsList.json');
            const data = await response.json();
            data.forEach(songData => {
                addSong(songData);
            });
        } catch (error) {
            console.error('Error loading songsList.json:', error);
        }
        updateSongCards();
    }

    // Update the DOM with song details
    function updateSongCards() {
        songs.forEach((song, index) => {
            const card = document.querySelector(`.card-${index}`);
            if (card) {
                const songNameElem = card.querySelector('.mainName');
                const artistElem = card.querySelector('.artistName');
                const imageElem = card.querySelector('.cardImage');
                const locationElem = card.querySelector('.songLocation');

                if (songNameElem) songNameElem.textContent = song.songName;
                if (artistElem) artistElem.textContent = song.artist;
                if (imageElem) imageElem.src = song.albumImage;
                if (locationElem) locationElem.textContent = song.location;
            }
        });
    }

    document.addEventListener('click', function(e) {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.style.display = 'none';
        }
        if (!profile.contains(e.target) && !profileMsg.contains(e.target)) {
            profileMsg.style.visibility = 'hidden';
        }
        statusVolume.style.visibility = 'hidden';
    });

    function updateWelcomeMessage() {
        const now = new Date();
        const hours = now.getHours();
        let message;

        if (hours >= 5 && hours < 12) {
            message = 'Good Morning!';
        } else if (hours >= 12 && hours < 18) {
            message = 'Good Afternoon!';
        } else {
            message = 'Good Evening!';
        }
        welcomeMsg.innerHTML = message;
    }
    // Call the function when the page loads
    window.onload = updateWelcomeMessage;

    // Assume profile and profileMsg are defined and reference the correct elements
    profile.addEventListener('click', visibilityProfileMessage);
    profile.addEventListener('mouseenter', visibilityProfileMessage);

    function visibilityProfileMessage() {
        // Toggle the visibility of profileMsg
        if (profileMsg.style.visibility === 'visible') {
            profileMsg.style.visibility = 'hidden';
        } else {
            profileMsg.style.visibility = 'visible';
        }
    }

    // Initial State of Application
    let currentSongIndex = 2;
    let isPlaying = false;
    let wasPlaying = false; // Not in use as of now
    let repeatMode = 'all';
    let queueIsOpen = false;
    audioPlayer.src = songs[currentSongIndex].location;

    // Function to update the page title based on the song status
    function updatePageTitle() {
        const title = isPlaying ? `Playing : ${songs[currentSongIndex].songName} - ${songs[currentSongIndex].artist}` : 'Music Player';
        document.title = title;
    }

    updatePageTitle();


    // Event Listeners
    playPause.addEventListener('click', playPauseSong);
    next.addEventListener('click', nextSong);
    previous.addEventListener('click', previousSong);

    // UI update on loading of page
    firstUIupdate();
    function firstUIupdate() {
        // Reset progress bar
        statusHead.style.left = '0px';
        statusTail.style.width = '0%';
        counterCount.textContent = '00:00'; // Reset to start time
        counterTotalCount.textContent = '00:00'; // Replace with actual total time
    }
    updateUI();
    // Update UI function
    // Works well for 5 songs but not for more songs
    function updateUI() {
        // Update song details
        // const songName = document.querySelector('.card-2 .mainName');
        // const artistName = document.querySelector('.card-2 .artistName');
        // const cardImage = document.querySelector('.card-2 .cardImage');

        // Main Card Details
        // const currentSong = songs[currentSongIndex];
        // songName.textContent = currentSong.songName;
        // artistName.textContent = currentSong.artist;
        // cardImage.src = currentSong.albumImage;

        card_0_image.src = songs[(currentSongIndex + songs.length - 2) % songs.length].albumImage;
        card_1_image.src = songs[(currentSongIndex + songs.length - 1) % songs.length].albumImage;
        card_2_image.src = songs[(currentSongIndex) % songs.length].albumImage;
        card_3_image.src = songs[(currentSongIndex + 1) % songs.length].albumImage;
        card_4_image.src = songs[(currentSongIndex + 2) % songs.length].albumImage;

        card_0_song.textContent = songs[(currentSongIndex + songs.length - 2) % songs.length].songName;
        card_1_song.textContent = songs[(currentSongIndex + songs.length - 1) % songs.length].songName;
        card_2_song.textContent = songs[(currentSongIndex) % songs.length].songName;
        card_3_song.textContent = songs[(currentSongIndex + 1) % songs.length].songName;
        card_4_song.textContent = songs[(currentSongIndex + 2) % songs.length].songName;

        card_0_artist.textContent = songs[(currentSongIndex + songs.length - 2) % songs.length].artist;
        card_1_artist.textContent = songs[(currentSongIndex + songs.length - 1) % songs.length].artist;
        card_2_artist.textContent = songs[(currentSongIndex) % songs.length].artist;
        card_3_artist.textContent = songs[(currentSongIndex + 1) % songs.length].artist;
        card_4_artist.textContent = songs[(currentSongIndex + 2) % songs.length].artist;

        updateLikeIcon();
        updatePageTitle();
    }

    

    // Play/Pause, Previous, Next functionality
    // function playPauseSong() {
    //     if (!isPlaying) {
    //         audioPlayer.play();
    //         isPlaying = true;
    //     } else {
    //         // Song is currently playing and is being paused
    //         audioPlayer.pause();
    //         isPlaying = false;
    //     }
    //     updatePlayPauseIcon();
    //     updateUI();
    //     updatePlayingSongInQueue();
    // }

    function playPauseSong() {
        if (!isPlaying) {
            audioPlayer.play();
            isPlaying = true;
            startLyricsSync(); // Start syncing lyrics when song starts
            displayLyrics(); // Load lyrics when starting to play a song
        } else {
            // Song is currently playing and is being paused
            audioPlayer.pause();
            isPlaying = false;
            stopLyricsSync();
        }
        updatePlayPauseIcon();
        updateUI();
        updatePlayingSongInQueue();
    }
    
    
    function updatePlayPauseIcon() {
        playPause.innerHTML = isPlaying 
        ?'<img src="r/pause.svg" alt="" srcset="">' 
        : '<img src="r/play.svg" alt="" srcset="">';
    }

    function nextSong() {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        audioPlayer.src = songs[currentSongIndex].location;
        audioPlayer.play();
        isPlaying = true;
        displayLyrics(); // Update lyrics when changing songs
        startLyricsSync();
        updatePlayPauseIcon();
        updateUI();
        updatePlayingSongInQueue();
    }
    

    function previousSong() {
        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        audioPlayer.src = songs[currentSongIndex].location;
        audioPlayer.play();
        isPlaying = true;
        displayLyrics(); // Update lyrics when changing songs
        startLyricsSync();
        updatePlayPauseIcon();
        updateUI();
        updatePlayingSongInQueue();
    }

    audioPlayer.addEventListener('timeupdate', function() {
        const currentTime = audioPlayer.currentTime;
        const duration = audioPlayer.duration;
        const progress = (currentTime / duration) * 100;

        statusHead.style.left = progress + '%';
        statusTail.style.width = progress + '%';

        const minutes = Math.floor(currentTime / 60);
        const seconds = Math.floor(currentTime % 60);
        counterCount.textContent = (minutes < 10 ? '0' : '') + minutes + ':' + (seconds < 10 ? '0' : '') + seconds;

        const totalMinutes = Math.floor(duration / 60);
        const totalSeconds = Math.floor(duration % 60);
        counterTotalCount.textContent = (totalMinutes < 10 ? '0' : '') + totalMinutes + ':' + (totalSeconds < 10 ? '0' : '') + totalSeconds;
    });

    function firstTimeSongDuration() {
        // Ensure audioPlayer is loaded
        if (audioPlayer.readyState >= 1) { // Check if metadata is loaded
            const duration0 = audioPlayer.duration;
            // Calculate minutes and seconds
            const min = Math.floor(duration0 / 60);
            const sec = Math.floor(duration0 % 60);
            // Format seconds as two digits
            const formattedSec = sec < 10 ? '0' + sec : sec;

            counterTotalCount.textContent = (min < 10 ? '0' : '') + min + ':' + formattedSec;
        } else {
            console.log("Audio metadata not loaded yet.");
        }
    }    
    audioPlayer.addEventListener('loadedmetadata', firstTimeSongDuration);

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

    // Like/Unlike functionality
    like.addEventListener('click', toggleLike);
    function toggleLike() {
        if (songs[currentSongIndex].liked == false){
            songs[currentSongIndex].liked = true;
        } else {
            songs[currentSongIndex].liked = false;
        }
        updateLikeIcon();
        updateQueue();
    }
    updateLikeIcon();
    function updateLikeIcon() {
        if (songs[currentSongIndex].liked) {
            like.innerHTML = '<img src="r/filled-heart.svg" alt="" srcset="">';
        } else {
            like.innerHTML = '<img src="r/empty-heart.svg" alt="" srcset="">';
        }
    }

    // Repeat functionality
    repeat.addEventListener('click', toggleRepeat);
    function toggleRepeat() {
        switch (repeatMode) {
            case 'all':
                repeatMode = 'one';
                break;
            case 'one':
                repeatMode = 'none';
                break;
            case 'none':
                repeatMode = 'all';
                break;
        }
        updateRepeatIcon();
    }
    function updateRepeatIcon() {
        switch (repeatMode) {
            case 'one':
                repeat.innerHTML = '<img src="r/repeat-one.svg" alt="" srcset="">';
                break;
            case 'none':
                repeat.innerHTML = '<img src="r/no-repeat.svg" alt="" srcset="">';
                break;
            case 'all':
                repeat.innerHTML = '<img src="r/repeat-all.svg" alt="" srcset="">';
                break;
        }
    }
    // Repeat functionality when song ends
    audioPlayer.addEventListener('ended', function() {
        if (repeatMode === 'one') {
            audioPlayer.src = songs[currentSongIndex].location;
            audioPlayer.play();
        } else if (repeatMode === 'all') {
            nextSong();
        }
    });

    // Volume Bar functionality
    volumeIcon.addEventListener('click', muteUnmute);
    volumeIcon.addEventListener('mouseover', volumeBarVisibility);
    updateVolumeLevel();
    function volumeBarVisibility() {
        statusVolume.style.visibility = 'visible';
    }
    function muteUnmute() {
        if (audioPlayer.volume === 0) {
            audioPlayer.volume = 1;
            updateVolumeLevel();
        } else {
            audioPlayer.volume = 0;
            updateVolumeLevel();
        }
    }
    function updateVolumeLevel() {
        const volume = audioPlayer.volume;
        volumeTail.style.width = (volume * 100) + '%';
        volumeHead.style.left = `calc(${volume * 100}% - 6px)`;
        updateVolumeIcon();
    };
    function updateVolumeIcon() {
        if (audioPlayer.volume === 0) {
            volumeIcon.innerHTML = '<img src="r/volume-0.svg" alt="" srcset="">';
        } else if (audioPlayer.volume <= 0.5) {
            volumeIcon.innerHTML = '<img src="r/volume-below-50.svg" alt="" srcset="">';
        } else {
            volumeIcon.innerHTML = '<img src="r/volume-above-50.svg" alt="" srcset="">';
        };
    }
    function setVolumeFromPosition(position) {
        const rect = volumeProgress.getBoundingClientRect();
        const offsetX = position - rect.left;
        const newVolume = Math.max(0, Math.min(1, offsetX / rect.width));
        audioPlayer.volume = newVolume;
        updateVolumeLevel();
    };
    function handleVolumeDrag(e) {
        setVolumeFromPosition(e.clientX);
    };
    // Clickable volume progress
    volumeProgress.addEventListener('click', function(e) {
        setVolumeFromPosition(e.clientX);
    });
    // Draggable volume control
    volumeHead.addEventListener('mousedown', function(e) {
        e.preventDefault(); // Prevent default behavior (text selection etc.)
        document.addEventListener('mousemove', handleVolumeDrag);
        document.addEventListener('mouseup', function() {
            document.removeEventListener('mousemove', handleVolumeDrag);
        }, { once: true });
    });

    // Fullscreen/Normalscreen functionality (shortcut key 'f')
    fullscreen.addEventListener('click', toggleFullscreen);

    function toggleFullscreen() {
        if (document.fullscreenElement) {
            document.exitFullscreen();
            normalScreenCardsLayout();
            lyricsDisplay.style.visibility = 'hidden';
            lyricsDisplay.style.opacity = '0';
        } else {
            document.documentElement.requestFullscreen();
            fullScreenCardsLayout();
            lyricsDisplay.style.visibility = 'visible';
            lyricsDisplay.style.opacity = '1';
        }
    }
    function fullScreenCardsLayout() {
        card_0.style.left = '180px';
        card_1.style.left = '190px';
        card_3.style.left = '190px';
        card_4.style.left = '180px';
        card_2.style.left = '200px';
        card_2.style.scale = '1.05';
        fullscreen.innerHTML = '<img src="r/exit-fullscreen.svg" alt="" srcset="">';
    }
    function normalScreenCardsLayout() {
        card_0.style.left = 'calc(50% - 360px)';
        card_1.style.left = 'calc(50% - 200px)';
        card_3.style.left = 'calc(50% + 130px)';
        card_4.style.left = 'calc(50% + 250px)';
        card_2.style.left = '50%';
        card_2.style.scale = '1';
        fullscreen.innerHTML = '<img src="r/fullscreen.svg" alt="" srcset="">';
    }


    // Dynamic Search functionality (shortcut key 's')
    searchInput.addEventListener('focus', searchResultVisibility);
    searchResults.addEventListener('mouseenter', searchResultVisibility);
    searchResults.addEventListener('mouseover', searchResultVisibility);
    function searchResultVisibility() {
        searchResults.style.display = 'block';
    }
    // Event listener for search input
    searchInput.addEventListener('input', function() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        filterSongs(searchTerm);
    });
    // Function to calculate relevance score
    function calculateScore(song, searchTerm) {
        const songNameScore = song.songName.toLowerCase().includes(searchTerm) ? 1 : 0;
        const artistScore = song.artist.toLowerCase().includes(searchTerm) ? 1 : 0;
        return songNameScore + artistScore;
    }
    // Function to handle dynamic search
    function filterSongs(searchTerm) {
        searchTerm = searchTerm.trim().toLowerCase(); // Trim and lowercase search term
        
        // Clear previous results
        searchListSongs.innerHTML = '';
        searchListArtists.innerHTML = '';

        // Perform search using the searchSongs function
        const searchResults = searchSongs(searchTerm);

        // Sort results based on relevance score
        searchResults.sort((a, b) => {
            const scoreA = calculateScore(a, searchTerm);
            const scoreB = calculateScore(b, searchTerm);
            return scoreB - scoreA; // Higher score comes first
        });

        // Create a Set to collect unique artists
        const uniqueArtists = new Set();

        // Display matched songs in ordered list
        searchResults.forEach((song, count) => {
            const songListItem = document.createElement('li');
            songListItem.textContent = `${count + 1}. ${song.songName} - ${song.artist}`;
            songListItem.addEventListener('click', function() {
                // Ensure the song exists in the songs array
                const songIndex = songs.findIndex(s => s.songName === song.songName && s.artist === song.artist);
                if (songIndex !== -1) {
                    currentSongIndex = songIndex;
                    audioPlayer.src = songs[currentSongIndex].location;
                    console.log('hi');
                    isPlaying = false;
                    playPauseSong();
                } else {
                    console.error('Song not found in the songs array');
                }
                // if (songIndex !== -1) {
                //     changeSong(songIndex);
                // }
            });
            searchListSongs.appendChild(songListItem);
            
            // Collect unique artists
            uniqueArtists.add(song.artist);
        });

        // Display unique artists in ordered list
        Array.from(uniqueArtists).forEach((artist, count) => {
            const artistListItem = document.createElement('li');
            artistListItem.textContent = `${count + 1}. ${artist}`;
            searchListArtists.appendChild(artistListItem);
        });
    }

    // Song playcount
    // ##############

    // Queue functionality
    queueList.addEventListener('click', toggleQueue);
    toggleQueue();
    function toggleQueue() {
        if (queueIsOpen) {
            queue.style.width = "320px";
            main.style.marginLeft = "320px";
            queueIsOpen = false;
            // lyricsDisplay.style.fontSize = '24px';
            lyricsDisplay.style.transform = 'translate(-35%, -55%)';
            lyricsDisplay.style.scale = '0.72';
        } else {
            queue.style.width = "0";
            main.style.marginLeft = "0";
            queueIsOpen = true;
            // lyricsDisplay.style.fontSize = '40px';
            lyricsDisplay.style.transform = 'translate(-20%, -40%)';
            lyricsDisplay.style.scale = '1';
        }
    }
    // queue
    const queueElements = {
        queue: document.querySelector('.queueElements.element1 .queueList'),
        favourites: document.querySelector('.queueElements.element2 .queueList'),
        mostPlayed: document.querySelector('.queueElements.element3 .queueList')
    };
    // Function to update the Playing Queue
    function updatePlayingQueue() {
        songs.forEach((song, index) => {
            const queueCard = document.createElement('div');
            queueCard.className = 'queueCard';
            
            const cardImage = document.createElement('div');
            cardImage.className = 'queueCardImage';
            const img = document.createElement('img');
            img.src = songs[index].albumImage;
            cardImage.appendChild(img);
            
            const cardDetails = document.createElement('div');
            cardDetails.className = 'queueCardDetails';
            const songName = document.createElement('span');
            songName.className = 'queueCardName';
            songName.textContent = songs[index].songName;
            const artistName = document.createElement('span');
            artistName.className = 'queueCardArtist';
            artistName.textContent = songs[index].artist;
            cardDetails.appendChild(songName);
            cardDetails.appendChild(artistName);
            
            queueCard.appendChild(cardImage);
            queueCard.appendChild(cardDetails);
            queueCard.addEventListener('click', function() {
                currentSongIndex = index;
                audioPlayer.src = songs[currentSongIndex].location;
                audioPlayer.play();
                isPlaying = true;
                updatePlayPauseIcon();
                displayLyrics(); // Update lyrics when changing songs
                startLyricsSync();
                updateUI();
                updatePlayingSongInQueue();
            });
            
            queueElements.queue.appendChild(queueCard);
        });
    }
    function updateFavouriteQueue() {
        const likedSongs = songs.filter(song => song.liked);
        likedSongs.forEach((song, index) => {
            const queueCard = document.createElement('div');
            queueCard.className = 'queueCard';

            const queueNumber = document.createElement('div');
            queueNumber.className = 'queueNumber';
            queueNumber.textContent = index + 1;
            
            const cardImage = document.createElement('div');
            cardImage.className = 'queueCardImage';
            const img = document.createElement('img');
            img.src = likedSongs[index].albumImage;
            cardImage.appendChild(img);
                
            const cardDetails = document.createElement('div');
            cardDetails.className = 'queueCardDetails';
            const songName = document.createElement('span');
            songName.className = 'queueCardName';
            songName.textContent = likedSongs[index].songName;
            const artistName = document.createElement('span');
            artistName.className = 'queueCardArtist';
            artistName.textContent = likedSongs[index].artist;
            cardDetails.appendChild(songName);
            cardDetails.appendChild(artistName);
                
            const favStatus = document.createElement('div');
            favStatus.className = 'favStatus';
            const favImg = document.createElement('img');
            favImg.src = 'r/filled-heart.svg';
            favStatus.appendChild(favImg);
                
            queueCard.appendChild(queueNumber);
            queueCard.appendChild(cardImage);
            queueCard.appendChild(cardDetails);
            queueCard.appendChild(favStatus);
            queueCard.addEventListener('click', function() {
                const songIndex = songs.indexOf(likedSongs[index]); // Find the original song index
                if (songIndex !== -1) { // Ensure the index is valid
                    currentSongIndex = songIndex;
                    audioPlayer.src = songs[songIndex].location;
                    audioPlayer.play();
                    isPlaying = true;
                    updatePlayPauseIcon();
                    displayLyrics(); // Update lyrics when changing songs
                    startLyricsSync();
                    updateUI();
                    updatePlayingSongInQueue();
                }
            });
            favImg.addEventListener('click', function(event) {
                event.stopPropagation(); // Prevent click event from propagating to queueCard
                const songIndex = songs.indexOf(likedSongs[index]); // Find the original song index
                if (songIndex !== -1) { // Ensure the index is valid
                    songs[songIndex].liked = false;
                    console.log(songIndex.liked);
                    updateLikeIcon();
                    updateQueue();
                }
            });
                
            queueElements.favourites.appendChild(queueCard);
        });
    }
    function updateMostPlayedQueue() {
        const sortedSongs = songs.slice().sort((a, b) => b.playCount - a.playCount);
        sortedSongs.slice(0, 3).forEach((song, index) => {
            const queueCard = document.createElement('div');
            queueCard.className = 'queueCard';
            
            const queueNumber = document.createElement('div');
            queueNumber.className = 'queueNumber';
            queueNumber.textContent = index + 1;
            
            const cardImage = document.createElement('div');
            cardImage.className = 'queueCardImage';
            const img = document.createElement('img');
            img.src = sortedSongs[index].albumImage;
            cardImage.appendChild(img);
            
            const cardDetails = document.createElement('div');
            cardDetails.className = 'queueCardDetails';
            const songName = document.createElement('span');
            songName.className = 'queueCardName';
            songName.textContent = sortedSongs[index].songName;
            const artistName = document.createElement('span');
            artistName.className = 'queueCardArtist';
            artistName.textContent = sortedSongs[index].artist;
            cardDetails.appendChild(songName);
            cardDetails.appendChild(artistName);
            
            queueCard.appendChild(queueNumber);
            queueCard.appendChild(cardImage);
            queueCard.appendChild(cardDetails);
            queueCard.addEventListener('click', function() {
                const songIndex = songs.indexOf(sortedSongs[index]); // Find the original song index
                if (songIndex !== -1) { // Ensure the index is valid
                    currentSongIndex = songIndex;
                    audioPlayer.src = songs[songIndex].location;
                    audioPlayer.play();
                    isPlaying = true;
                    updatePlayPauseIcon();
                    displayLyrics(); // Update lyrics when changing songs
                    startLyricsSync();
                    updateUI();
                    updatePlayingSongInQueue();
                }
            });
            
            queueElements.mostPlayed.appendChild(queueCard);
        });
    }
    function updatePlayingSongInQueue() {
        // Highlight playing song in queue
        const queueCards = document.querySelectorAll('.queueCard');
        queueCards.forEach((card, index) => {
            if (index === currentSongIndex) {
                card.classList.add('playingSongQueue');
            } else {
                card.classList.remove('playingSongQueue');
            }
        });
    }
    // Function to update the queue
    function updateQueue() {
        // Clear existing queue
        queueElements.queue.innerHTML = '';
        queueElements.favourites.innerHTML = '';
        queueElements.mostPlayed.innerHTML = '';

        updatePlayingQueue();
        updateFavouriteQueue();
        updateMostPlayedQueue();

        updatePlayingSongInQueue();
    }
    // Initial call to populate the queue
    updateQueue();

    
    
    // Key shortcuts functionality
    document.addEventListener('keydown', function(e) {
        if (e.code === 'Space' && document.activeElement !== document.getElementById('search-bar')) {
            e.preventDefault(); // Prevent scrolling the page down
            playPauseSong();
        } else if (e.code === 'ArrowRight' && document.activeElement !== document.getElementById('search-bar')) {
            // Seek forward 10 seconds
            audioPlayer.currentTime += 10;
        } else if (e.code === 'ArrowLeft' && document.activeElement !== document.getElementById('search-bar')) {
            // Seek backward 10 seconds
            audioPlayer.currentTime -= 10;
        } else if (e.code === 'KeyN' && document.activeElement !== document.getElementById('search-bar')) {
            // Play next song
            nextSong();
        } else if (e.code === 'KeyP' && document.activeElement !== document.getElementById('search-bar')) {
            // Play previous song
            previousSong();
        } else if (e.code === 'KeyS' && document.activeElement !== document.getElementById('search-bar')) {
            // Activate the search bar
            e.preventDefault(); // Prevent the 'f' key from being entered into the search bar
            searchInput.focus();
        } else if (e.code === 'KeyF' && document.activeElement !== document.getElementById('search-bar')) {
            // Toggle fullscreen mode
            e.preventDefault(); // Prevent the 's' key from being entered into the search bar
            toggleFullscreen();
        } else if (e.code === 'KeyM' && document.activeElement !== document.getElementById('search-bar')) {
            // Toggle mute/unmute
            muteUnmute();
        } else if (e.code === 'KeyL' && document.activeElement !== document.getElementById('search-bar')) {
            // Toggle mute/unmute
            toggleLike();
        } else if (e.code === 'ArrowUp' && document.activeElement !== document.getElementById('search-bar')) {
            // Increase volume by 10units
            audioPlayer.volume += 0.1;
            updateVolumeLevel();
            // updateVolumeIcon();
        } else if (e.code === 'ArrowDown' && document.activeElement !== document.getElementById('search-bar')) {
            // Decrease volume by 10units
            audioPlayer.volume -= 0.1;
            updateVolumeLevel();
        } else if (e.code === 'KeyR' && document.activeElement !== document.getElementById('search-bar')) {
            // Toggle repeat mode
            toggleRepeat();
        } else if (e.code === 'KeyQ' && document.activeElement !== document.getElementById('search-bar')) {
            // Toggle Queue
            toggleQueue();
        }
    });


    // Lyrics functionality
    let lyrics = []; // Store parsed lyrics

    async function displayLyrics() {
        const currentSong = songs[currentSongIndex];
        if (currentSong && currentSong.lyrics) {
            try {
                lyrics = await fetchLyrics(currentSong.lyrics);
                lyricsDisplay.innerHTML = ''; // Clear previous lyrics
            } catch (error) {
                console.error('Error fetching lyrics:', error);
                lyricsDisplay.innerHTML = 'Lyrics not available';
            }
        } else {
            lyricsDisplay.innerHTML = 'No lyrics available';
        }
    }
    

    function updateLyricsDisplay() {
        const currentTime = audioPlayer.currentTime; // Current playback time in seconds
        const visibleLyrics = lyrics.filter(line => line.time <= currentTime);
    
        // Show only the most recent lyrics
        const lastLyric = visibleLyrics[visibleLyrics.length - 1];
        if (lastLyric) {
            lyricsDisplay.innerHTML = `<p>${lastLyric.text}</p>`;
        }
    }
    
    
    let lyricsUpdateInterval;

    function startLyricsSync() {
        if (lyricsUpdateInterval) {
            clearInterval(lyricsUpdateInterval); // Clear any existing interval
        }
        lyricsUpdateInterval = setInterval(updateLyricsDisplay, 500); // Update every 500 ms
    }

    function stopLyricsSync() {
        if (lyricsUpdateInterval) {
            clearInterval(lyricsUpdateInterval);
        }
    }

    // let lastClickTime = 0;

    // document.addEventListener('dblclick', function(event) {
    //     const currentTime = new Date().getTime();
    //     const timeDiff = currentTime - lastClickTime;

    //     if (timeDiff < 1000) { // Fast double click threshold (300 ms)
    //         toggleFullscreen();
    //     }

    //     lastClickTime = currentTime;
    // });


});
