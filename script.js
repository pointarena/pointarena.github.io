document.addEventListener('DOMContentLoaded', function() {
    // Navbar active link highlighting
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Model filtering functionality
    const modelTypeFilter = document.querySelector('.filter-group select:first-of-type');
    const providerFilter = document.querySelector('.filter-group select:last-of-type');
    const modelCards = document.querySelectorAll('.model-card');

    if (modelTypeFilter && providerFilter) {
        const filterModels = () => {
            const typeValue = modelTypeFilter.value;
            const providerValue = providerFilter.value;
            
            modelCards.forEach(card => {
                const modelType = card.querySelector('.badge:first-of-type').textContent;
                const provider = card.querySelector('.badge:last-of-type').textContent;
                
                const typeMatch = typeValue === 'All Types' || modelType === typeValue;
                const providerMatch = providerValue === 'All Providers' || provider.includes(providerValue);
                
                card.closest('.col-md-4').style.display = typeMatch && providerMatch ? 'block' : 'none';
            });
        };
        
        modelTypeFilter.addEventListener('change', filterModels);
        providerFilter.addEventListener('change', filterModels);
    }

    // Leaderboard sorting functionality for all ranking tables
    document.querySelectorAll('.leaderboard-table').forEach(leaderboardTable => {
        const headers = leaderboardTable.querySelectorAll('thead th');
        let currentSortCol = 0; // Default sort by rank
        let sortDirection = 'asc';
        
        headers.forEach((header, index) => {
            // Skip first column (rank) as it's already sorted
            if (index === 0) return;
            
            header.style.cursor = 'pointer';
            header.addEventListener('click', () => {
                sortTable(leaderboardTable, index);
            });
            
            // Add sort indicator
            const sortIndicator = document.createElement('span');
            sortIndicator.classList.add('sort-indicator');
            sortIndicator.style.marginLeft = '5px';
            sortIndicator.innerHTML = '↕';
            header.appendChild(sortIndicator);
        });
        
        function sortTable(table, columnIndex) {
            const tbody = table.querySelector('tbody');
            const rows = Array.from(tbody.querySelectorAll('tr'));
            
            // Reset all indicators
            headers.forEach(h => {
                const indicator = h.querySelector('.sort-indicator');
                if (indicator) indicator.innerHTML = '↕';
            });
            
            // Set new indicator
            const indicator = headers[columnIndex].querySelector('.sort-indicator');
            
            // Toggle sort direction if clicking on same column
            if (currentSortCol === columnIndex) {
                sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
            } else {
                sortDirection = 'asc';
                currentSortCol = columnIndex;
            }
            
            // Update indicator
            indicator.innerHTML = sortDirection === 'asc' ? '↑' : '↓';
            
            // Sort the rows
            rows.sort((a, b) => {
                let aValue = a.cells[columnIndex].textContent;
                let bValue = b.cells[columnIndex].textContent;
                
                // Handle numeric values
                if (!isNaN(parseFloat(aValue))) {
                    aValue = parseFloat(aValue);
                    bValue = parseFloat(bValue);
                }
                
                if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
                return 0;
            });
            
            // Re-append rows in new order
            rows.forEach(row => tbody.appendChild(row));
        }
    });

    // Card hover effects enhancement
    const cards = document.querySelectorAll('.model-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
            this.style.boxShadow = '0 12px 20px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        });
    });

    // Add a small animation to hero section
    const heroContent = document.querySelector('.hero-section .container');
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(20px)';
        heroContent.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        
        setTimeout(() => {
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 300);
    }

    // Add scroll reveal animation to sections
    const sections = document.querySelectorAll('section:not(.hero-section)');
    const revealSection = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    };
    
    const sectionObserver = new IntersectionObserver(revealSection, {
        root: null,
        threshold: 0.15,
    });
    
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        
        sectionObserver.observe(section);
    });
    
    document.addEventListener('scroll', () => {
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (sectionTop < windowHeight * 0.85) {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }
        });
    });

    // CSV Data Loading functionality
    const csvDownloadButtons = document.querySelectorAll('.csv-download .btn');
    csvDownloadButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.closest('section');
            const sectionId = section.id;
            
            // Define CSV file paths based on section ID
            let csvPath;
            switch(sectionId) {
                case 'point-bench':
                    csvPath = 'data/point-bench.csv';
                    break;
                case 'point-battle':
                    csvPath = 'data/point-battle.csv';
                    break;
                case 'point-act':
                    csvPath = 'data/point-act.csv';
                    break;
                default:
                    console.error('Unknown section ID');
                    return;
            }
            
            // Download the CSV file
            downloadCSV(csvPath);
        });
    });
    
    function downloadCSV(filePath) {
        fetch(filePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.blob();
            })
            .then(blob => {
                // Create a temporary URL for the blob
                const url = window.URL.createObjectURL(blob);
                
                // Create a temporary anchor element and trigger download
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = filePath.split('/').pop();
                document.body.appendChild(a);
                a.click();
                
                // Clean up
                window.URL.revokeObjectURL(url);
                a.remove();
            })
            .catch(error => {
                console.error('Error downloading CSV:', error);
                alert('Failed to download CSV file. Please try again later.');
            });
    }

    // Function to create directory structure for CSV files if implementing
    function createDataDirectories() {
        // This would typically be done on the server side
        // For GitHub Pages, you would manually create these directories and files
        console.log('Data directories should be created manually for GitHub Pages');
    }

    // Function to parse CSV data
    function parseCSV(csv) {
        const lines = csv.trim().split('\n');
        const headers = lines[0].split(',');
        
        return lines.slice(1).map(line => {
            const values = line.split(',');
            const entry = {};
            
            headers.forEach((header, index) => {
                entry[header.trim()] = values[index]?.trim() || '';
            });
            
            return entry;
        });
    }

    // Function to load CSV data
    async function loadCSV(url) {
        const response = await fetch(url);
        const text = await response.text();
        return parseCSV(text);
    }

    // Function to safely parse numeric values
    function safeParseFloat(value, fallback = 0) {
        if (value === undefined || value === null || value === '') {
            return fallback;
        }
        
        // Remove any % character if present
        if (typeof value === 'string' && value.includes('%')) {
            value = value.replace('%', '');
        }
        
        const parsed = parseFloat(value);
        return isNaN(parsed) ? fallback : parsed;
    }

    // Function to update Point-Bench leaderboard
    async function updatePointBenchTable() {
        try {
            const data = await loadCSV('data/point-bench.csv');
            const tableBody = document.querySelector('#point-bench .leaderboard-table tbody');
            tableBody.innerHTML = '';
            
            // Sort by Average score (descending)
            data.sort((a, b) => safeParseFloat(b.Average) - safeParseFloat(a.Average));
            
            // Only display top 5 results
            data.forEach((row, index) => {
                const tr = document.createElement('tr');
                
                tr.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${row[''] || row.Model || ''}</td>
                    <td class="score">${safeParseFloat(row.Affordance).toFixed(2)}</td>
                    <td class="score">${safeParseFloat(row.Spatial).toFixed(2)}</td>
                    <td class="score">${safeParseFloat(row.Reasoning).toFixed(2)}</td>
                    <td class="score">${safeParseFloat(row.Steerability).toFixed(2)}</td>
                    <td class="score">${safeParseFloat(row.Counting).toFixed(2)}</td>
                    <td class="score">${safeParseFloat(row.Average).toFixed(3)}</td>
                `;
                
                tableBody.appendChild(tr);
            });
            
            // Hide loading indicator
            document.querySelector('#point-bench .loading-indicator').style.display = 'none';
        } catch (error) {
            console.error('Error loading point-bench.csv:', error);
            document.querySelector('#point-bench .loading-indicator').innerHTML = 
                '<p class="text-danger">Error loading data. Please try again later.</p>';
        }
    }

    // Function to update Point-Battle leaderboard
    async function updatePointBattleTable() {
        try {
            const data = await loadCSV('data/point-battle.csv');
            const tableBody = document.querySelector('#point-battle .leaderboard-table tbody');
            tableBody.innerHTML = '';
            
            // Sort by Elo Rating (descending) just to be sure
            data.sort((a, b) => safeParseFloat(b['Elo Rating']) - safeParseFloat(a['Elo Rating']));
            
            // Display all available results
            data.forEach((row, index) => {
                const tr = document.createElement('tr');
                
                tr.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${row.Model || ''}</td>
                    <td class="score">${safeParseFloat(row['Elo Rating']).toFixed(1)}</td>
                    <td class="score">${safeParseFloat(row.Wins, 0)}</td>
                    <td class="score">${safeParseFloat(row.Losses, 0)}</td>
                    <td class="score">${row['Win Rate'] || '0%'}</td>
                `;
                
                tableBody.appendChild(tr);
            });
            
            // Hide loading indicator
            document.querySelector('#point-battle .loading-indicator').style.display = 'none';
        } catch (error) {
            console.error('Error loading point-battle.csv:', error);
            document.querySelector('#point-battle .loading-indicator').innerHTML = 
                '<p class="text-danger">Error loading data. Please try again later.</p>';
        }
    }

    // Function to update Point-Act leaderboard
    async function updatePointActTable() {
        try {
            const data = await loadCSV('data/point-act.csv');
            const tableBody = document.querySelector('#point-act .leaderboard-table tbody');
            tableBody.innerHTML = '';
            
            // Sort by Success Rate (descending)
            data.sort((a, b) => safeParseFloat(b['Success Rate']) - safeParseFloat(a['Success Rate']));
            
            data.forEach((row) => {
                const tr = document.createElement('tr');
                
                tr.innerHTML = `
                    <td>${row.Challenge || ''}</td>
                    <td class="score">${safeParseFloat(row['Success Rate'])}</td>
                    <td class="score">${safeParseFloat(row['SUS Score'])}</td>
                `;
                
                tableBody.appendChild(tr);
            });
            
            // Hide loading indicator
            document.querySelector('#point-act .loading-indicator').style.display = 'none';
        } catch (error) {
            console.error('Error loading point-act.csv:', error);
            document.querySelector('#point-act .loading-indicator').innerHTML = 
                '<p class="text-danger">Error loading data. Please try again later.</p>';
        }
    }

    // Gallery functionality
    let galleryData = [];
    let currentExampleIndex = 0;
    let filteredGalleryData = [];

    async function loadGalleryData() {
        try {
            const response = await fetch('data/gallery/data.json');
            if (!response.ok) {
                throw new Error(`Failed to load gallery data: ${response.status}`);
            }
            galleryData = await response.json();
            
            // Use the data directly without checking all files first
            // This avoids multiple HEAD requests that can lead to broken pipes
            filteredGalleryData = [...galleryData];
            
            console.log(`Loaded ${filteredGalleryData.length} gallery examples`);
            return filteredGalleryData;
        } catch (error) {
            console.error('Error loading gallery data:', error);
            return [];
        }
    }

    function displayGalleryExample(index) {
        if (!filteredGalleryData || !filteredGalleryData.length) {
            // Handle case where no valid examples exist
            const carousel = document.querySelector('#exampleCarousel .carousel-inner');
            if (carousel) {
                carousel.innerHTML = '<div class="carousel-item active"><div class="text-center p-5">No valid examples found. Please check the image files.</div></div>';
            }
            
            const queryText = document.getElementById('queryText');
            const categoryBadge = document.getElementById('categoryBadge');
            const countInfo = document.getElementById('countInfo');
            
            if (queryText) queryText.textContent = '';
            if (categoryBadge) categoryBadge.textContent = '';
            if (countInfo) countInfo.style.display = 'none';
            return;
        }
        
        // Get example data
        const example = filteredGalleryData[index];
        if (!example) return;
        
        // Get DOM elements
        const carousel = document.querySelector('#exampleCarousel .carousel-inner');
        const queryText = document.getElementById('queryText');
        const categoryBadge = document.getElementById('categoryBadge');
        const countInfo = document.getElementById('countInfo');
        
        if (!carousel || !queryText || !categoryBadge || !countInfo) {
            console.error('Missing required DOM elements for gallery display');
            return;
        }
        
        // Clear existing items
        carousel.innerHTML = '';
        
        // Create carousel item
        const carouselItem = document.createElement('div');
        carouselItem.className = 'carousel-item active';
        
        // Create image container with both original and mask
        const imageContainer = document.createElement('div');
        imageContainer.className = 'gallery-image-container position-relative';
        
        // Original image with error handling
        const originalImg = document.createElement('img');
        originalImg.className = 'gallery-image d-block w-100 original-image';
        originalImg.alt = 'Original image';
        originalImg.src = `data/gallery/${example.image_filename}`;
        originalImg.dataset.src = `data/gallery/${example.image_filename}`;
        originalImg.onerror = function() {
            this.onerror = null;
            this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2YxZjFmMSIvPjx0ZXh0IHg9IjQwMCIgeT0iMjAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMzZweCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzk5OTk5OSI+SW1hZ2Ugbm90IGF2YWlsYWJsZTwvdGV4dD48L3N2Zz4=';
        };
        
        // Mask image with error handling
        const maskImg = document.createElement('img');
        maskImg.className = 'gallery-image d-block w-100 mask-image';
        maskImg.alt = 'Mask';
        maskImg.src = `data/gallery/${example.mask_filename}`;
        maskImg.dataset.src = `data/gallery/${example.mask_filename}`;
        maskImg.style.display = 'none';
        maskImg.onerror = function() {
            this.onerror = null;
            this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2YxZjFmMSIvPjx0ZXh0IHg9IjQwMCIgeT0iMjAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMzZweCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzk5OTk5OSI+TWFzayBpbWFnZSBub3QgYXZhaWxhYmxlPC90ZXh0Pjwvc3ZnPg==';
        };
        
        // Add images to container
        imageContainer.appendChild(originalImg);
        imageContainer.appendChild(maskImg);
        
        // Add image container to carousel item
        carouselItem.appendChild(imageContainer);
        
        // Add carousel item to carousel
        carousel.appendChild(carouselItem);
        
        // Update metadata
        queryText.textContent = example.user_input || 'No query provided';
        categoryBadge.textContent = example.category || 'Unknown';
        
        // Update count info if available
        if (example.count) {
            countInfo.textContent = `Count: ${example.count}`;
            countInfo.style.display = 'inline-block';
        } else {
            countInfo.style.display = 'none';
        }
        
        // Set color based on category
        const categoryColors = {
            'spatial': 'bg-primary',
            'reasoning': 'bg-success',
            'affordable': 'bg-warning',
            'steerable': 'bg-info',
            'counting': 'bg-danger'
        };
        
        // Reset all classes and add the appropriate one
        categoryBadge.className = 'badge';
        categoryBadge.classList.add(categoryColors[example.category] || 'bg-secondary');
        
        currentExampleIndex = index;
    }

    function filterGalleryByCategory(category) {
        if (category === 'all') {
            filteredGalleryData = [...galleryData];
        } else {
            filteredGalleryData = galleryData.filter(item => item.category === category);
        }
        
        if (filteredGalleryData.length > 0) {
            displayGalleryExample(0);
        } else {
            // No examples for this category
            const carousel = document.querySelector('#exampleCarousel .carousel-inner');
            carousel.innerHTML = '<div class="carousel-item active"><div class="text-center p-5">No examples found for this category</div></div>';
            
            const queryText = document.getElementById('queryText');
            const categoryBadge = document.getElementById('categoryBadge');
            const countInfo = document.getElementById('countInfo');
            
            queryText.textContent = '';
            categoryBadge.textContent = '';
            countInfo.style.display = 'none';
        }
    }

    async function initGallery() {
        await loadGalleryData();
        
        if (galleryData.length) {
            displayGalleryExample(0);
            
            // Initialize view mode buttons
            const showOriginalBtn = document.getElementById('showOriginal');
            const showMaskBtn = document.getElementById('showMask');
            const showOverlayBtn = document.getElementById('showOverlay');
            
            if (showOriginalBtn && showMaskBtn && showOverlayBtn) {
                // Show original image
                showOriginalBtn.addEventListener('click', () => {
                    // Load original images if they're still showing placeholders
                    document.querySelectorAll('.original-image').forEach(img => {
                        if (img.src !== img.dataset.src && img.dataset.src) {
                            img.src = img.dataset.src;
                        }
                        img.style.display = 'block';
                    });
                    document.querySelectorAll('.mask-image').forEach(img => img.style.display = 'none');
                    document.querySelectorAll('.gallery-image-container').forEach(container => container.classList.remove('overlay-mode'));
                    
                    // Update button states
                    showOriginalBtn.classList.add('active');
                    showMaskBtn.classList.remove('active');
                    showOverlayBtn.classList.remove('active');
                });
                
                // Show mask only
                showMaskBtn.addEventListener('click', () => {
                    document.querySelectorAll('.original-image').forEach(img => img.style.display = 'none');
                    
                    // Load mask images if they're still showing placeholders
                    document.querySelectorAll('.mask-image').forEach(img => {
                        if (img.src !== img.dataset.src && img.dataset.src) {
                            img.src = img.dataset.src;
                        }
                        img.style.display = 'block';
                    });
                    
                    document.querySelectorAll('.gallery-image-container').forEach(container => container.classList.remove('overlay-mode'));
                    
                    // Update button states
                    showOriginalBtn.classList.remove('active');
                    showMaskBtn.classList.add('active');
                    showOverlayBtn.classList.remove('active');
                });
                
                // Show overlay (both original and mask)
                showOverlayBtn.addEventListener('click', () => {
                    // Load original images if they're still showing placeholders
                    document.querySelectorAll('.original-image').forEach(img => {
                        if (img.src !== img.dataset.src && img.dataset.src) {
                            img.src = img.dataset.src;
                        }
                        img.style.display = 'block';
                    });
                    
                    // Load mask images if they're still showing placeholders
                    document.querySelectorAll('.mask-image').forEach(img => {
                        if (img.src !== img.dataset.src && img.dataset.src) {
                            img.src = img.dataset.src;
                        }
                        img.style.display = 'block';
                        img.style.opacity = '0.7';
                        img.style.position = 'absolute';
                        img.style.top = '0';
                        img.style.left = '0';
                    });
                    
                    document.querySelectorAll('.gallery-image-container').forEach(container => container.classList.add('overlay-mode'));
                    
                    // Update button states
                    showOriginalBtn.classList.remove('active');
                    showMaskBtn.classList.remove('active');
                    showOverlayBtn.classList.add('active');
                });
            }
            
            // Initialize category filter
            const categoryFilter = document.getElementById('categoryFilter');
            if (categoryFilter) {
                categoryFilter.addEventListener('change', function() {
                    filterGalleryByCategory(this.value);
                });
            }
            
            // Initialize carousel navigation
            const carousel = document.getElementById('exampleCarousel');
            if (carousel) {
                const prevButton = carousel.querySelector('.carousel-control-prev');
                const nextButton = carousel.querySelector('.carousel-control-next');
                
                prevButton.addEventListener('click', () => {
                    currentExampleIndex = (currentExampleIndex - 1 + filteredGalleryData.length) % filteredGalleryData.length;
                    displayGalleryExample(currentExampleIndex);
                });
                
                nextButton.addEventListener('click', () => {
                    currentExampleIndex = (currentExampleIndex + 1) % filteredGalleryData.length;
                    displayGalleryExample(currentExampleIndex);
                });
            }
        }
    }

    // Initialize tables and features
    async function initializeTables() {
        try {
            await Promise.all([
                updatePointBenchTable(),
                updatePointBattleTable(),
                updatePointActTable(),
                initGallery()
            ]);
            
            // Hide all loading indicators once data is loaded
            document.querySelectorAll('.loading-indicator').forEach(indicator => {
                indicator.style.display = 'none';
            });
        } catch (error) {
            console.error('Error initializing tables:', error);
            document.querySelectorAll('.loading-indicator').forEach(indicator => {
                indicator.innerHTML = '<p class="text-danger">Error loading data. Please try again later.</p>';
            });
        }
    }
    
    // Initialize everything
    initializeTables();
}); 