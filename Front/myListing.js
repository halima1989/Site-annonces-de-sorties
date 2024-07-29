let cards = document.querySelector('.cards')

async function getMyListings() {
    let jwt = window.localStorage.getItem('jwt')

    let request = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            Authorization: `Bearer ${jwt}`,
        },
    }

    let apiRequest = await fetch('http://localhost:3003/listing/mine', request)
    let response = await apiRequest.json()

    response.forEach((listing) => {
        cards.innerHTML += `<div class='w-1/3 h-72 mx-6 my-6'><img src='${listing.image}' class='w-48 h-48 object-cover' /> <h2>${listing.title}</h2> <p>${listing.description}</p> <p>${listing.price}</p>' <div> <button class='btnDelete-${listing._id}' > <i class="fa-solid fa-trash"></i> </button>  <button class='ml-2 btnEdit-${listing._id}' >         <i class="fa-solid fa-pen-to-square"></i>
 </button> </div></div>`

        let btn = document.querySelector(`.btnDelete-${listing._id}`)
        btn.addEventListener('click', () => {
            deleteListing(listing._id)
        })

        let btn2 = document.querySelector(`.btnEdit-${listing._id}`)
        btn2.addEventListener('click', () => {
            editListing(listing._id, listing)
        })
    })
}

getMyListings()

async function deleteListing(listingId) {
    let request = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(id),
    }

    let apiRequest = await fetch('http://localhost:3339/listing/mine', request)
    let response = await apiRequest.json()
}
let modal = document.querySelector('.modal')

async function editListing(listingId, listing) {
    let title = document.querySelector('.title')
    let description = document.querySelector('.description')
    let price = document.querySelector('.price')
    let image = document.querySelector('.image')
    let category = document.querySelector('.category')

    title.value = listing.title
    description.value = listing.description
    price.value = listing.price
    image.value = listing.image
    category.value = listing.category

    modal.classList.remove('hidden')
}

function endEditListing() {
    modal.classList.add('hidden')

    let title = document.querySelector('.title').value
    let description = document.querySelector('.description').value
    let price = document.querySelector('.price').value
    let image = document.querySelector('.image').value
    let category = document.querySelector('.category').value

    console.log(title, description, price, image)

    // let request = {
    //     method: 'PATCH',
    //     headers: {
    //         'Content-Type': 'application/json; charset=utf-8',
    //     },
    //     body: JSON.stringify(id),
    // }
    // let apiRequest = await fetch('http://localhost:3003/listing/mine', request)
    // let response = await apiRequest.json()
}

async function getAllListings() {

    let request = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
        },
    }

    let apiRequest = await fetch('http://localhost:3003/listing/all', request)
    let response = await apiRequest.json()

    response.forEach((listing) => {
        cards.innerHTML += `<div class='w-1/3 h-72 mx-6 my-6'><img src='${listing.image}' class='w-48 h-48 object-cover' /> <h2>${listing.title}</h2> <p>${listing.description}</p> <p>${listing.price}</p>' <div> <button class='btnDelete-${listing._id}' > <i class="fa-solid fa-trash"></i> </button>  <button class='ml-2 btnEdit-${listing._id}' >         <i class="fa-solid fa-pen-to-square"></i>
 </button> </div></div>`

        let btn = document.querySelector(`.btnDelete-${listing._id}`)
        btn.addEventListener('click', () => {
            deleteListing(listing._id)
        })

        let btn2 = document.querySelector(`.btnEdit-${listing._id}`)
        btn2.addEventListener('click', () => {
            editListing(listing._id, listing)
        })
    })
}