/**** STATE ****/
let contactList = []
let contactToEditId = null

/**** RENDERING & LISTENING ****/
const contactsContainer = document.getElementById("contacts-container")
const textarea = document.getElementById("textarea")

/** Render a list of contacts */
function renderContactList() {
    // Clear out anything from previous renders
    contactsContainer.innerHTML = ""

    // If there's no contacts, show an empty message
    if (contactList.length === 0) {
        contactsContainer.innerHTML = "No contacts yet"
    }

    // For each contact, map it to a div, then append that div to the container
    contactList.map(renderContact).forEach(div => contactsContainer.appendChild(div))
}

/**Render one contact*/
function renderContact(contact) {
    const contactDiv = document.createElement("div")
    contactDiv.className = "bg-light mb-3 p-4"
    contactDiv.innerHTML = `
        <h5>${contact.name}</h5>
        <p>${contact.phonenumber}</p>
        <p>${contact.email}</p>
        <p>${contact.address}</p>
        <button id="edit-button" class="btn btn-sm btn-outline-primary">Edit</button>
        <button id="delete-button" class="btn btn-sm btn-outline-danger">Delete</button>
    `
    // Attach the event listener to the edit button that gets the form ready to edit
    contactDiv.querySelector("#edit-button").addEventListener("click", () => {
        console.log(`Editing contact with ID: ${contact.id}`)
        contactToEditId = contact.id
        renderContactForm(contact)
    })
    // Attach the event listener to the delete button that deletes the contact
    contactDiv.querySelector("#delete-button").addEventListener("click", async () => {
        console.log(`Deleting contact with ID: ${contact.id}`);
        // Delete on the backend first
        await deleteContact(contact.id)
        // Delete on the frontend
        const indexToDelete = contactList.indexOf(contact);
        contactList.splice(indexToDelete, 1)

        renderContactList()
    })
    return contactDiv
}
/*

/**Update the contact form to match the contact data given*/
function renderContactForm(contactData) {
    document.getElementById("nametextarea").value = contactData.name || '';
    document.getElementById("pntextarea").value = contactData.phonenumber || '';
    document.getElementById("emailtextarea").value = contactData.email || '';
    document.getElementById("addresstextarea").value = contactData.address || '';
}

/*** When the save button is clicked, either save an edit or a create*/
async function onSaveContactClick(event) {
    event.preventDefault()
    const nextId = contactList.length > 0 ? Math.max(...contactList.map(c => c.id)) + 1 : 1; // Assign the next available ID

    const contactData = {
        id: nextId.toString(), 
        name: document.getElementById("nametextarea").value.trim(), 
        phonenumber: document.getElementById("pntextarea").value.trim(), 
        email: document.getElementById("emailtextarea").value.trim(), 
        address: document.getElementById("addresstextarea").value.trim()
    }

    if(contactToEditId !== null) {
        // Update on backend
        contactData.id = contactToEditId
        await putContact(contactData)

        // Update on frontend
        const indexToReplace = contactList.findIndex(c => c.id === contactToEditId)
        contactList[indexToReplace] = contactData
    } else {
        // Update on backend
        const createdContact = await postContact(contactData)

        // Update on frontend
        contactList.push(createdContact)
    }

    renderContactList()
    contactToEditId = null
    // Clear the form
    renderContactForm({text: "" })
}

/**** FETCHING ****/

async function fetchAllContacts() {
    const response = await fetch("http://localhost:3000/contact")
    return response.json()
}

async function postContact(newContactData) {
    const response = await fetch("http://localhost:3000/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newContactData)
    })
    return response.json()
}

async function putContact(updatedContact) {
    await fetch("http://localhost:3000/contact/" + updatedContact.id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedContact)
    })
}

async function deleteContact(id) {
    console.log("Received request to delete contact with ID:", id);
    await fetch(`http://localhost:3000/contact/${id}`, {
        method: "DELETE"
    })
}

/**** START UP ****/

async function startUp() {
    contactList = await fetchAllContacts()
    renderContactList()
}

startUp()