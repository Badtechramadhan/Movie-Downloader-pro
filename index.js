<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Premium Movie Downloader</title>
    <style>
        :root {
            --primary: #3498db;
            --secondary: #2ecc71;
            --dark: #2c3e50;
            --light: #ecf0f1;
            --danger: #e74c3c;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 1000px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
            color: #333;
            line-height: 1.6;
        }
        
        header {
            text-align: center;
            margin-bottom: 30px;
        }
        
        h1 {
            color: var(--dark);
            margin-bottom: 10px;
        }
        
        .search-container {
            background-color: white;
            padding: 25px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            margin-bottom: 30px;
        }
        
        .search-form {
            display: flex;
            gap: 15px;
            flex-wrap: wrap;
        }
        
        .form-group {
            flex: 1;
            min-width: 200px;
        }
        
        label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: var(--dark);
        }
        
        input[type="text"] {
            width: 100%;
            padding: 12px;
            border: 2px solid #ddd;
            border-radius: 6px;
            font-size: 16px;
            transition: border-color 0.3s;
        }
        
        input[type="text"]:focus {
            border-color: var(--primary);
            outline: none;
        }
        
        button {
            background-color: var(--primary);
            color: white;
            border: none;
            padding: 12px 25px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 16px;
            font-weight: 600;
            transition: all 0.3s;
            align-self: flex-end;
        }
        
        button:hover {
            background-color: #2980b9;
            transform: translateY(-2px);
        }
        
        .result-container {
            background-color: white;
            border-radius: 10px;
            padding: 25px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            margin-top: 20px;
        }
        
        .movie-title {
            font-size: 24px;
            font-weight: 700;
            color: var(--dark);
            margin-bottom: 10px;
        }
        
        .download-section {
            margin-top: 20px;
            padding: 15px;
            background-color: #f8f9fa;
            border-radius: 8px;
        }
        
        .download-btn {
            display: inline-block;
            background-color: var(--secondary);
            color: white;
            text-align: center;
            padding: 12px 25px;
            border-radius: 6px;
            text-decoration: none;
            font-weight: 600;
            margin-top: 15px;
            transition: background-color 0.3s;
        }
        
        .download-btn:hover {
            background-color: #27ae60;
        }
        
        .quality-info {
            color: #7f8c8d;
            font-size: 14px;
            margin-top: 5px;
        }
        
        .loading {
            text-align: center;
            padding: 40px;
        }
        
        .spinner {
            border: 5px solid rgba(0, 0, 0, 0.1);
            width: 50px;
            height: 50px;
            border-radius: 50%;
            border-left-color: var(--primary);
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .error {
            color: var(--danger);
            background-color: #fadbd8;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
            text-align: center;
        }
        
        .no-results {
            text-align: center;
            padding: 30px;
            color: #7f8c8d;
            font-size: 18px;
        }
        
        @media (max-width: 768px) {
            .search-form {
                flex-direction: column;
            }
        }
    </style>
</head>
<body>
    <header>
        <h1>Premium Movie Downloader</h1>
        <p>Get direct download links for your favorite movies</p>
    </header>
    
    <div class="search-container">
        <div class="search-form">
            <div class="form-group">
                <label for="movieName">Movie Name</label>
                <input type="text" id="movieName" placeholder="e.g. Moana, Avengers">
            </div>
            <div class="form-group">
                <label for="episode">Episode (for series)</label>
                <input type="text" id="episode" placeholder="Leave empty for movies">
            </div>
            <button id="searchBtn">Search</button>
        </div>
    </div>
    
    <div id="loading" class="loading" style="display: none;">
        <div class="spinner"></div>
        <p>Searching for movies...</p>
    </div>
    
    <div id="error" class="error" style="display: none;"></div>
    
    <div id="result" class="result-container" style="display: none;">
        <div id="resultContent"></div>
    </div>
    
    <script>
        document.getElementById('searchBtn').addEventListener('click', searchMovie);
        
        async function searchMovie() {
            const movieName = document.getElementById('movieName').value.trim();
            const episode = document.getElementById('episode').value.trim();
            
            if (!movieName) {
                showError('Please enter a movie name');
                return;
            }
            
            // Show loading, hide results and error
            document.getElementById('loading').style.display = 'block';
            document.getElementById('error').style.display = 'none';
            document.getElementById('result').style.display = 'none';
            
            try {
                // Prepare API URL based on your API's response structure
                let apiUrl = `https://henz-api.zone.id/api/moviedl?moviename=${encodeURIComponent(movieName)}`;
                if (episode) {
                    apiUrl += `&episode=${encodeURIComponent(episode)}`;
                }
                
                // Make the API request
                const response = await fetch(apiUrl);
                const data = await response.json();
                
                if (!data.success) {
                    showError(data.message || 'Movie not found');
                    return;
                }
                
                displayResult(data);
            } catch (error) {
                showError('Error fetching movie: ' + error.message);
            } finally {
                document.getElementById('loading').style.display = 'none';
            }
        }
        
        function displayResult(data) {
            const resultContent = document.getElementById('resultContent');
            resultContent.innerHTML = '';
            
            // Extract clean movie name by removing the (NKIRI COM) part
            const cleanMovieName = data.movie.replace(/\(.*?\)/g, '').trim();
            
            // Create result HTML
            resultContent.innerHTML = `
                <h2 class="movie-title">${cleanMovieName}</h2>
                <div class="download-section">
                    <p>Ready to download:</p>
                    <a href="${data.download_link}" class="download-btn" target="_blank">Download Now</a>
                    <p class="quality-info">${extractQualityInfo(data.movie)}</p>
                </div>
            `;
            
            document.getElementById('result').style.display = 'block';
        }
        
        function extractQualityInfo(movieString) {
            // Extract quality information from the movie string
            if (movieString.includes('WEB-DL')) return 'Quality: WEB-DL (Excellent)';
            if (movieString.includes('HD')) return 'Quality: HD (High Definition)';
            if (movieString.includes('CAM')) return 'Quality: CAM (Theater Recording)';
            return 'Quality: Good';
        }
        
        function showError(message) {
            const errorDiv = document.getElementById('error');
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        }
    </script>
</body>
</html>
