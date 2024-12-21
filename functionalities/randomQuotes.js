
const requestUrl = 'https://api.allorigins.win/raw?url=https://zenquotes.io/api/random';
const quotesContainer = document.getElementById("random-quote");

(async () => {
    fetch(requestUrl)
    .then(response => response.json())
    .then(data => quotesContainer.innerHTML = data[0].h)//h = html having quote and footer
    .catch(err => quotesContainer.innerText = err.message)
}
)();//IIFE (Immediately Invoked Function Expression)


