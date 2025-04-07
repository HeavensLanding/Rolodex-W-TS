import "bootstrap/dist/css/bootstrap.min.css"
import { deleteContact, putContact, fetchAllContacts, postContact } from "./api"
import renderContactForm from "./renderContactform"

type Contact = {
  id: number
  name: string
  phonenumber: string
  email: string
  address: string
}

/**** STATE ****/
let contactList: contactList[] = []
let contactToEditId: null | number = null

/**** RENDERING & LISTENING ****/
const contactsContainer = document.getElementById("contacts-container")!
const textarea = document.getElementById("textarea")
document.getElementById("save-button")!.addEventListener("click", onSaveContactClick)

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
function renderContact(contact: Contact) {
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
    contactDiv.querySelector("#edit-button")!.addEventListener("click", () => {
        console.log(`Editing contact with ID: ${contact.id}`)
        contactToEditId = contact.id
        renderContactForm(contact)
    })
    // Attach the event listener to the delete button that deletes the contact
    contactDiv.querySelector("#delete-button")!.addEventListener("click", async () => {
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


/*** When the save button is clicked, either save an edit or a create*/
async function onSaveContactClick(event: Event) {
    event.preventDefault()
    const nextId = contactList.length > 0 ? Math.max(...contactList.map(c => c.id)) + 1 : 1; // Assign the next available ID
    const phonenumber = (document as Document).getElementById('pntextarea') as HTMLInputElement;
    const name = (document as Document).getElementById("nametextarea") as HTMLInputElement;
    const email = (document as Document).getElementById("emailtextarea") as HTMLInputElement;
    const address = (document as Document).getElementById("addresstextarea") as HTMLInputElement;
    
    const contactData = {
        id: nextId.toString(), 
        name: name.value.trim(), 
        phonenumber: phonenumber.value.trim(), 
        email: email.value.trim(), 
        address: address.value.trim()
    }

    if(contactToEditId !== null) {
        // Update on backend
        const contactToUpdate = {
            ...contactData,
            id: contactToEditId
        }
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
    renderContactForm({string: "" })
}

/**** START UP ****/

async function startUp() {
    contactList = await fetchAllContacts()
    renderContactList()
}

startUp()