import { onSaveContactClick } from "./main";

/**Update the contact form to match the contact data given*/
export default function renderContactForm(contactData: {name: string, phonenumber: string, email: string, address: string}) {
    document.getElementById("nametextarea")!.value = contactData.name || '';
    document.getElementById("pntextarea")!.value = contactData.phonenumber || '';
    document.getElementById("emailtextarea")!.value = contactData.email || '';
    document.getElementById("addresstextarea")!.value = contactData.address || '';
}