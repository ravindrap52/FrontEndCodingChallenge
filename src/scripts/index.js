import "../styles/index.scss";
import "../assets/images/logo-en-white.svg";
import "../assets/images/user.jpg";

console.log("welcome on board!");

const hotelObj = (function() {
  document.getElementById("filterHotels").addEventListener("click", () => {
    filterButton();
  });
  const starRef = document.getElementsByClassName("star");
  Array.from(starRef).forEach(element => {
    element.addEventListener("click", event => {
      selectStar(event);
    });
  });
  const pageCount = 10;
  const stars = 3;
  const maxprice = 300;
  const url = "http://fake-hotel-api.herokuapp.com/api/hotels";
  const reviewURL = "http://fake-hotel-api.herokuapp.com/api/reviews";

  /**
   * @param  {} =>{letqueryParams={pageCount
   * @param  {} stars};makeApiCall(queryParams
   */
  const getHotelDetails = () => {
    let queryParams = {
      pageCount,
      stars,
      maxprice
    };
    makeApiCall(queryParams);
  };

  /**
   * @param  {} `${url}?count=${params.pageCount}`
   * @param  {} .then(response=>response.json(
   * @param  {} .then(data=>{if(data&&data.length
   * @param  {} {processData(data
   * @param  {} ;}}
   * @param  {} .catch(error=>{returnnewError("unexpectederroroccured"
   * @param  {} ;}
   */
  const makeApiCall = params => {
    fetch(
      `${url}?count=${params.pageCount}&min_stars=${params.stars}&max_price=${params.maxprice}`
    )
      .then(response => response.json())
      .then(data => {
        if (data && data.length) {
          createCard(data);
        }
      })
      .catch(error => {
        return new Error("unexpected error occured");
      });
  };
  /**
   * @param  {} "div"
   * @param  {} ;divElement.classList.add("rating"
   * @param  {} "pb-1"
   * @param  {} ;for(leti=0;i<ratings;i++
   * @param  {} {constspanElement=document.createElement("span"
   * @param  {} ;spanElement.classList.add("rating--filled"
   * @param  {} ;spanElement.innerHTML="&#9733;";divElement.appendChild(spanElement
   */
  const generateRatings = element => {
    let ratings = element.stars;
    const divElement = document.createElement("div");
    divElement.classList.add("rating", "pb-1");
    for (let i = 0; i < ratings; i++) {
      const spanElement = document.createElement("span");
      spanElement.classList.add("rating--filled", "pr-2");
      spanElement.innerHTML = "&#9733;";
      divElement.appendChild(spanElement);
    }
    return divElement.innerHTML;
  };

  /**
   * @param  {} cardElement
   */
  const createCard = cardElement => {
    const element = document.getElementById("card--container");
    element.innerHTML = `
        ${cardElement
          .map((item, i) =>
            `
        <div class="cards">
            <div class="cards__item">
              <div class="card">
                <div>
                  <img
                    src="${item.images[0]}"
                    height="240px"
                    class="card__image"
                    onerror="this.onerror=null; this.src='src/assets/images/network-error-default-image.jpeg'"
                    />
                </div>
                <div class="card__content">
                  <div class="heading pb-1">${item.name}</div>
                  <div class="pb-1">
                    <p class="heading d-inline">${item.country}</p>
                    <span class="heading">, ${item.city}</span>
                  </div>
                  <div class="pb-1">
                    <p class="heading d-inline">&#8364; ${
                      item.price
                    }</p> <span class="heading-1">per person</span>
                    <span>
                      <button type="button" class="button reviews"  data-hotelId=${
                        item.id
                      }>
                          View Reviews
                    </button>
                    </span>
                  </div>
                  ${generateRatings(item)}
                </div>
              </div>
            </div>
          </div>
  `.trim()
          )
          .join("")}
    `;
    const reviewsRef = document.getElementsByClassName("reviews");
    Array.from(reviewsRef).forEach(element => {
      element.addEventListener("click", event => {
        fetch(
          `${reviewURL}?hotel_id=${event.target.getAttribute("data-hotelId")}`
        )
          .then(response => response.json())
          .then(data => {
            if (data && data.length) {
              createReviewCard(data);
            }
          })
          .catch(error => {
            return new Error("unexpected error occured");
          });

        // Get the modal
        var modal = document.getElementById("myModal");
        modal.style.display = "block";
        modal.style.zIndex = 1000;

        // Get the <span> element that closes the modal
        var span = document.getElementsByClassName("close")[0];

        // When the user clicks on <span> (x), close the modal
        span.onclick = function() {
          modal.style.display = "none";
        };

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function(event) {
          if (event.target == modal) {
            modal.style.display = "none";
          }
        };
      });
    });
  };
  /**
   */
  const selectStar = event => {
    let element = document.getElementById(event.target.id);
    let elementId = Number(element.id);
    let elemId = "";
    let i = 1;
    while (i <= elementId) {
      elemId = i.toString();
      let clickedElem = document.getElementById(elemId);
      clickedElem.classList.add("rating--filled");
      i++;
    }
    while (i <= 5) {
      elemId = i.toString();
      let clickedElem = document.getElementById(elemId);
      clickedElem.classList.remove("rating--filled");
      i++;
    }
  };
  /**
   * @param  {} =>{constrange=document.getElementById("priceRange"
   */
  const filterButton = () => {
    let starArr = [];
    let stars = document.getElementsByClassName("star");
    for (let i = 0; i < stars.length; i++) {
      if (stars[i].classList.contains("rating--filled")) {
        starArr.push(stars[i]);
      }
    }
    const range = document.getElementById("priceRange");
    let filterObj = {
      pageCount: 10,
      stars: Number(starArr.length),
      maxprice: Number(range.value)
    };
    makeApiCall(filterObj);
  };

  const createReviewCard = reviewData => {
    const reviewContainer = document.getElementById("review--container");
    reviewContainer.innerHTML = `
        ${reviewData
          .map((item, i) =>
            `
        <div class="reviewBox">
            <div class="reviewRow">
              <div class="reviewBoxLeft">
                <p class="heading pb-1 ">
                  ${item.comment}
                </p>
                <p class="header-1 pb-1 ">
                  ${item.name}
                </p>
              </div>
            </div>
          </div>
  `.trim()
          )
          .join("")}
    `;
  };
  return {
    hotelDetails: getHotelDetails
  };
})();

hotelObj.hotelDetails();
