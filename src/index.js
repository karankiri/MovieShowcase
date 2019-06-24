import "./scss/main.scss";
import * as data from './data.json';

const defaultImgSrc = data.defaultMoviePoster;


document.addEventListener('DOMContentLoaded', function() {
    var appInstance = new App();
    appInstance.switchTabs(0);
    appInstance.showMovie();
 });


class App {

    constructor() {
        this.currentMovies = data.movies;
        this.state = {
            currrentTab: 0,
            filter: 0,
            tabContainers: ["movieShowcase","searchResults"],
            buttonIds: ["movieShowcaseButton","searchTabButton"]
        };
        this.ApiURL = "https://www.omdbapi.com/?apikey=45048e3e&type=movie&s=";
        this.bindEvents();
    }

    bindEvents() {
        document.getElementById("movieShowcaseButton").addEventListener('click', ()=> {
            this.switchTabs(0);
        });
        document.getElementById("searchTabButton").addEventListener('click', ()=> {
            this.switchTabs(1);
        });
        document.getElementsByTagName("input")[0].addEventListener('change', (event)=> {
            this.searchMovie(event.target.value);
        });
        document.getElementsByTagName("select")[0].addEventListener('change', (event)=> {
            this.sortMovies(event.target.value);
        });
        document.getElementById("loaderImg").src = data.loader;
    }

    searchMovie(val) {
        this.loading(true);
        var url =  this.ApiURL + val;
    
        fetch(url)
        .then(response => response.json())
        .then(data => {
            this.currentMovies = data.Search || [];
            this.showMovie();
        })
    }

    showNoResults() {
        var template = document.getElementById("template-movie-not-found");
        // Get the contents of the template
        var templateHtml = template.innerHTML;
        
        document.getElementById(this.state.tabContainers[this.state.currrentTab]).innerHTML = templateHtml;
        this.loading(false);
    }
    
    showMovie() {
        if(this.currentMovies.length === 0) {
            this.showNoResults();
            return;
        }
        // Cache of the template
        var template = document.getElementById("template-movie-item");
        // Get the contents of the template
        var templateHtml = template.innerHTML;
        // Final HTML variable as empty string
        var listHtml = "";
        if(this.state.filter !== 0) {
            this.currentMovies.sort((movie1, movie2) => {
                var value1, value2;
                if(this.state.filter===1) { 
                    value1 = movie1.Title.toLowerCase();
                    value2 = movie2.Title.toLowerCase();
                } else if(this.state.filter===2) {
                    value1 = parseInt(movie1.Year);
                    value2 = parseInt(movie2.Year);
                }
                    if (value1 < value2) //sort string ascending
                    return -1;
                    if (value1 > value2)
                    return 1;
                    return 0;
            });
        } else {
            this.shuffleArray(this.currentMovies);
        }
        var data = this.currentMovies;
        // Loop through dataObject, replace placeholder tags
        // with actual data, and generate final HTML
        for (var key in data) {
            data[key]["Poster"] = data[key]["Poster"] === "N/A" ? defaultImgSrc : data[key]["Poster"];
        listHtml += templateHtml.replace(/{{imdbID}}/g, data[key]["imdbID"])
                                .replace(/{{Poster}}/g, data[key]["Poster"])
                                .replace(/{{Title}}/g, data[key]["Title"])
                                .replace(/{{Year}}/g, data[key]["Year"]);
        }
    
        // Replace the HTML of #container with final HTML
        document.getElementById(this.state.tabContainers[this.state.currrentTab]).innerHTML = listHtml;
        this.loading(false);
    }
    
    
    sortMovies(value) {
        console.log(value);
        if(value==="1") {
            this.state.filter = 1;
        } else if(value==="2") {
            this.state.filter = 2;
        } else {
            this.state.filter = 0;
        }    
        
        this.showMovie();
    }
    
    switchTabs(tab) {
        this.state.currrentTab = tab;
        if(tab === 0) {
            var searchResultsTab = document.getElementById(this.state.tabContainers[1]);
            searchResultsTab.style.display = "none";
            var movieShowcaseTab = document.getElementById(this.state.tabContainers[0]);
            movieShowcaseTab.style.display = "block";
            var searchResultsButton = document.getElementById(this.state.buttonIds[0]);
            searchResultsButton.classList.add("disabled");
            var movieShowCaseButton = document.getElementById(this.state.buttonIds[1]);
            movieShowCaseButton.classList.remove("disabled");
            var input = document.getElementsByTagName("input");
            input[0].style.display = "none";
        } else {
            var searchResultsTab = document.getElementById(this.state.tabContainers[1]);
            searchResultsTab.style.display = "block";
            var movieShowcaseTab = document.getElementById(this.state.tabContainers[0]);
            movieShowcaseTab.style.display = "none";
            var searchResultsButton = document.getElementById(this.state.buttonIds[0]);
            searchResultsButton.classList.remove("disabled");
            var movieShowCaseButton = document.getElementById(this.state.buttonIds[1]);
            movieShowCaseButton.classList.add("disabled");
            var input = document.getElementsByTagName("input");
            input[0].style.display = "block";
        }
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    loading(enable)  {
        var loader = document.getElementById('loader');
        if(enable) {
            loader.style.display = "block";
        } else {
            loader.style.display = "none";
        }
    }
}

