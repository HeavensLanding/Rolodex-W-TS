type Contact = {
    id: number
    name: string
    phonenumber: string
    email: string
    address: string
}



/**** FETCHING ****/
export async function fetchAllContacts() {
    const response = await fetch("http://localhost:3000/contact")
    return response.json()
}

export async function postContact(newContactData: Contact) {
    const response = await fetch("http://localhost:3000/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newContactData)
    })
    return response.json()
}

export async function putContact(updatedContact: Contact) {
    await fetch("http://localhost:3000/contact/" + updatedContact.id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedContact)
    })
}

export async function deleteContact(id: {id: number}) {
    console.log("Received request to delete contact with ID:", id);
    await fetch(`http://localhost:3000/contact/${id}`, {
        method: "DELETE"
    })
}
