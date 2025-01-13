'use strict';

// Array to store Song objects
const songs = [];

// Standard Song class
class Song {
    constructor(songName, artist, album, albumImage, liked = false, playCount = 0, location = '', lyrics = '') {
        this.songName = songName;
        this.artist = artist;
        this.album = album;
        this.albumImage = albumImage;
        this.liked = liked;
        this.playCount = playCount;
        this.location = location;
        this.lyrics = lyrics;
    }

    toggleLike() {
        this.liked = !this.liked;
    }

    incrementPlayCount() {
        this.playCount++;
    }

    // Static method to create Song objects from a plain object
    static fromObject(obj) {
        const { songName, artist, album, albumImage, liked, playCount, location, lyrics} = obj;
        return new Song(songName, artist, album, albumImage, liked, playCount, location, lyrics);
    }
}

// Function to add a new song
function addSong(songData) {
    const newSong = Song.fromObject(songData);
    songs.push(newSong);
}

// Function to search songs by songName or artist
function searchSongs(searchTerm) {
    searchTerm = searchTerm.toLowerCase().trim();
    return songs.filter(song =>
        song.songName.toLowerCase().includes(searchTerm) ||
        song.artist.toLowerCase().includes(searchTerm)
    );
}

// Function to parse lyrics from a string
function parseLyrics(lyricsText) {
    const lines = lyricsText.split('\n');
    const lyrics = [];

    lines.forEach(line => {
        const match = line.match(/\[(\d{2}):(\d{2}\.\d{2})\](.+)/);
        if (match) {
            const minutes = parseInt(match[1], 10);
            const seconds = parseFloat(match[2]);
            const time = minutes * 60 + seconds;
            lyrics.push({ time, text: match[3] });
        }
    });

    return lyrics;
}



async function fetchLyrics(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch lyrics: ${response.statusText}`);
        }
        const lyricsText = await response.text();
        return parseLyrics(lyricsText);
    } catch (error) {
        console.error('Error fetching lyrics:', error);
        return []; // Return an empty array on error
    }
}


// Exporting entities for modularization
export { Song, songs, addSong, searchSongs, fetchLyrics };