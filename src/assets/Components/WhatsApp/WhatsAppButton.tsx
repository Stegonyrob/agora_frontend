import { FloatingWhatsApp } from "./FloatingWhatsApp";


/**
 * Repo: https://github.com/awran5/react-floating-whatsapp
 */

export default function WhatsAppButton() {
    return (
        <div className="App">
            <FloatingWhatsApp
                phoneNumber="34693545993"
                accountName="Centro Educativo Ágora"
                allowEsc
                allowClickAway
                notification
                notificationSound
            />
        </div>
    );
}
