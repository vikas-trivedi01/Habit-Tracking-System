const quotes = {
  feelingGoodQuotes: [
    "Success is the sum of small efforts, repeated day in and day out.",
    "Your hard work is paying off! Stay consistent and keep growing.",
    "Every positive habit you build today makes tomorrow even brighter."
  ],
  feelingUnmotivatedQuotes: [
    "Discipline is the bridge between goals and accomplishment. ",
    "Don't wait for motivation; start small and let progress inspire you.",
    "The secret of your future is hidden in your daily routine."
  ],
  feelingBadQuotes: [
    "It's okay to fall, but it's not okay to stay down. Keep moving forward.",
    "Even the darkest night will end, and the sun will rise. Start fresh tomorrow.",
    "Difficult days are part of the journey. Progress comes from pushing through."
  ]

}


 

  const checkboxes = Array.from(document.querySelectorAll("#quotes-ul input[type='checkbox']"));

  function displayQuotes() {
    const quotesContainer = document.getElementById("quotes");
    quotesContainer.innerHTML = "";
  checkboxes.forEach(checkbox =>{
  //   const currentCheckbox = checkboxes.indexOf(checkbox);
  //   const previousCheckbox =  checkboxes.indexOf(checkboxes[checkbox-1])
  //   const nextCheckbox =  checkboxes.indexOf(checkboxes[checkbox+1])
    if(checkbox.checked){
      const mood = checkbox.id.replace('-suggestion','Quotes');

      if(quotes[mood]){
        quotes[mood].forEach(quote =>{
          const p = document.createElement("p");
          p.textContent = quote;
          quotesContainer.appendChild(p);
        });
      }
    }
   });
   if (!quotesContainer.innerHTML) {
    quotesContainer.innerHTML = "<p>Please select a mood.</p>";
  }
   const quotesSection = document.getElementById("quotes-section");

   //Get div to display quotes
   quotesSection.style.display = "block";
  }
  checkboxes.forEach(checkbox =>{
    checkbox.addEventListener("change",displayQuotes);
  })
