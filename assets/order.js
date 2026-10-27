/* Purchase / renewal request page. It saves a REQUEST through the backend's public purchase-request
   function (Turnstile-checked, insert only). It is not a payment: nothing is charged on this website. */
(()=>{'use strict';
const P=window.TELLYRO_PLANS,C=window.TELLYRO_CONFIG||{};if(!P)return;
const LANGS=['en','de','tr','fr','es','it'];
const T=(en,de,tr,fr,es,it)=>({en,de,tr,fr,es,it});
const S={
 title:T('Purchase or Renew a Plan | Tellyro','Tarif kaufen oder verlängern | Tellyro','Paket satın al veya yenile | Tellyro','Acheter ou renouveler une offre | Tellyro','Comprar o renovar un plan | Tellyro','Acquista o rinnova un piano | Tellyro'),
 skip:T('Skip to the request form','Zum Anfrageformular springen','Talep formuna geç','Aller au formulaire','Ir al formulario','Vai al modulo'),
 support:T('Support','Support','Destek','Assistance','Soporte','Assistenza'),
 back:T('Back to plans','Zurück zu den Tarifen','Paketlere dön','Retour aux offres','Volver a los planes','Torna ai piani'),
 eyebrow:T('Plan request','Tarifanfrage','Paket talebi','Demande d’offre','Solicitud de plan','Richiesta piano'),
 h1a:T('Purchase or renew','Tarif kaufen','Paketinizi satın alın','Achetez ou renouvelez','Compra o renueva','Acquista o rinnova'),
 h1b:T('your plan.','oder verlängern.','veya yenileyin.','votre offre.','tu plan.','il tuo piano.'),
 lead:T('Check your plan, add your details and submit the request. Our team then arranges payment and activation with you on WhatsApp or Telegram.','Prüfen Sie Ihren Tarif, geben Sie Ihre Daten ein und senden Sie die Anfrage. Unser Team klärt anschließend Zahlung und Aktivierung mit Ihnen über WhatsApp oder Telegram.','Paketinizi kontrol edin, bilgilerinizi girin ve talebinizi gönderin. Ekibimiz ödeme ve aktivasyonu sizinle WhatsApp veya Telegram üzerinden ayarlar.','Vérifiez votre offre, indiquez vos coordonnées et envoyez la demande. Notre équipe organise ensuite le paiement et l’activation avec vous sur WhatsApp ou Telegram.','Revisa tu plan, añade tus datos y envía la solicitud. Después, nuestro equipo acuerda contigo el pago y la activación por WhatsApp o Telegram.','Controlla il piano, inserisci i tuoi dati e invia la richiesta. Il nostro team concorderà poi con te pagamento e attivazione su WhatsApp o Telegram.'),
 s1:T('What would you like to do?','Was möchten Sie tun?','Ne yapmak istiyorsunuz?','Que souhaitez-vous faire ?','¿Qué quieres hacer?','Cosa vuoi fare?'),
 purchase:T('New purchase','Neukauf','Yeni satın alma','Nouvel achat','Compra nueva','Nuovo acquisto'),
 purchaseSub:T('Start a new subscription','Neues Abo starten','Yeni abonelik başlatın','Commencer un nouvel abonnement','Empezar una nueva suscripción','Inizia un nuovo abbonamento'),
 renewal:T('Renewal','Verlängerung','Yenileme','Renouvellement','Renovación','Rinnovo'),
 renewalSub:T('Extend an existing account','Bestehendes Konto verlängern','Mevcut hesabı uzatın','Prolonger un compte existant','Ampliar una cuenta existente','Estendi un account esistente'),
 s2:T('Choose your plan','Tarif wählen','Paketinizi seçin','Choisissez votre offre','Elige tu plan','Scegli il piano'),
 devices:T('Devices','Geräte','Cihazlar','Appareils','Dispositivos','Dispositivi'),
 devNote:T('The number of screens that can watch at the same time.','Anzahl der Bildschirme, die gleichzeitig schauen können.','Aynı anda izleyebilecek ekran sayısı.','Nombre d’écrans pouvant regarder en même temps.','Número de pantallas que pueden ver a la vez.','Numero di schermi che possono guardare contemporaneamente.'),
 duration:T('Duration','Laufzeit','Süre','Durée','Duración','Durata'),
 best:T('Best value','Bester Preis','En avantajlı','Meilleur prix','Mejor precio','Più conveniente'),
 priceNote:T('Prices in USD. Each price is the total for the full duration, not a monthly charge.','Preise in USD. Jeder Preis gilt für die gesamte Laufzeit und ist keine monatliche Gebühr.','Fiyatlar USD cinsindendir. Her fiyat tüm sürenin toplamıdır, aylık ücret değildir.','Prix en USD. Chaque prix correspond au total de la durée, pas à un montant mensuel.','Precios en USD. Cada precio es el total de toda la duración, no un cargo mensual.','Prezzi in USD. Ogni prezzo è il totale per l’intera durata, non un costo mensile.'),
 s3:T('Your details','Ihre Angaben','Bilgileriniz','Vos coordonnées','Tus datos','I tuoi dati'),
 name:T('Full name','Vollständiger Name','Ad soyad','Nom complet','Nombre completo','Nome e cognome'),
 email:T('Email address','E-Mail-Adresse','E-posta adresi','Adresse e-mail','Correo electrónico','Indirizzo e-mail'),
 acct:T('Account to renew','Zu verlängerndes Konto','Yenilenecek hesap','Compte à renouveler','Cuenta que quieres renovar','Account da rinnovare'),
 acctHint:T('Enter the username from your Tellyro login details, or the email address your subscription is registered to.','Geben Sie den Benutzernamen aus Ihren Tellyro-Zugangsdaten ein oder die E-Mail-Adresse, auf die Ihr Abo läuft.','Tellyro giriş bilgilerinizdeki kullanıcı adını veya aboneliğinizin kayıtlı olduğu e-posta adresini girin.','Indiquez l’identifiant de vos accès Tellyro ou l’adresse e-mail associée à votre abonnement.','Escribe el nombre de usuario de tus datos de acceso a Tellyro o el correo con el que está registrada tu suscripción.','Inserisci il nome utente dei tuoi dati di accesso Tellyro o l’indirizzo e-mail con cui è registrato l’abbonamento.'),
 msg:T('Message (optional)','Nachricht (optional)','Mesaj (isteğe bağlı)','Message (facultatif)','Mensaje (opcional)','Messaggio (facoltativo)'),
 reqNote:T('* Required.','* Pflichtfeld.','* Zorunlu.','* Obligatoire.','* Obligatorio.','* Obbligatorio.'),
 privNote:T('How we use your details:','So verwenden wir Ihre Daten:','Bilgilerinizi nasıl kullanıyoruz:','Utilisation de vos données :','Cómo usamos tus datos:','Come usiamo i tuoi dati:'),
 privacy:T('Privacy Policy','Datenschutzerklärung','Gizlilik Politikası','Politique de confidentialité','Política de privacidad','Informativa sulla privacy'),
 terms:T('Terms of Service','Nutzungsbedingungen','Hizmet Şartları','Conditions d’utilisation','Condiciones del servicio','Termini di servizio'),
 home:T('Home','Startseite','Ana sayfa','Accueil','Inicio','Home'),
 guides:T('Installation Guides','Installationsanleitungen','Kurulum rehberleri','Guides d’installation','Guías de instalación','Guide di installazione'),
 sumH:T('Your request','Ihre Anfrage','Talebiniz','Votre demande','Tu solicitud','La tua richiesta'),
 type:T('Request','Anfrage','Talep','Demande','Solicitud','Richiesta'),
 plan:T('Plan','Tarif','Paket','Offre','Plan','Piano'),
 total:T('Total price','Gesamtpreis','Toplam fiyat','Prix total','Precio total','Prezzo totale'),
 totalSub:T('USD · for the full duration','USD · für die gesamte Laufzeit','USD · tüm süre için','USD · pour toute la durée','USD · por toda la duración','USD · per l’intera durata'),
 nextH:T('What happens next','So geht es weiter','Sonraki adımlar','La suite','Qué pasa después','Cosa succede dopo'),
 next1:T('We save your request. Nothing is charged.','Wir speichern Ihre Anfrage. Es wird nichts berechnet.','Talebinizi kaydederiz. Herhangi bir ücret alınmaz.','Nous enregistrons votre demande. Rien n’est facturé.','Guardamos tu solicitud. No se cobra nada.','Salviamo la tua richiesta. Non viene addebitato nulla.'),
 next1off:T('We prepare your request message. Nothing is charged.','Wir bereiten Ihre Anfragenachricht vor. Es wird nichts berechnet.','Talep mesajınızı hazırlarız. Herhangi bir ücret alınmaz.','Nous préparons le message de votre demande. Rien n’est facturé.','Preparamos el mensaje de tu solicitud. No se cobra nada.','Prepariamo il messaggio della tua richiesta. Non viene addebitato nulla.'),
 next2:T('You message us on WhatsApp or Telegram. We prepare the message for you.','Sie schreiben uns über WhatsApp oder Telegram. Die Nachricht bereiten wir für Sie vor.','Bize WhatsApp veya Telegram’dan yazarsınız. Mesajı sizin için hazırlarız.','Vous nous écrivez sur WhatsApp ou Telegram. Nous préparons le message pour vous.','Nos escribes por WhatsApp o Telegram. Te preparamos el mensaje.','Ci scrivi su WhatsApp o Telegram. Il messaggio te lo prepariamo noi.'),
 next3:T('Our team confirms the payment options with you, then activates or extends your plan.','Unser Team bespricht mit Ihnen die Zahlungsmöglichkeiten und aktiviert oder verlängert dann Ihren Tarif.','Ekibimiz ödeme seçeneklerini sizinle netleştirir, ardından paketinizi etkinleştirir veya uzatır.','Notre équipe vous confirme les moyens de paiement, puis active ou prolonge votre offre.','Nuestro equipo te confirma las opciones de pago y después activa o amplía tu plan.','Il nostro team ti conferma le modalità di pagamento, poi attiva o estende il tuo piano.'),
 submit:T('Submit Request','Anfrage senden','Talebi gönder','Envoyer la demande','Enviar solicitud','Invia richiesta'),
 sending:T('Sending your request…','Anfrage wird gesendet…','Talebiniz gönderiliyor…','Envoi de votre demande…','Enviando tu solicitud…','Invio della richiesta…'),
 noPay:T('Submitting sends a request only. No payment is taken on this website.','Sie senden nur eine Anfrage. Auf dieser Website wird keine Zahlung abgewickelt.','Yalnızca bir talep gönderirsiniz. Bu web sitesinde ödeme alınmaz.','Vous envoyez seulement une demande. Aucun paiement n’est effectué sur ce site.','Solo envías una solicitud. En esta web no se realiza ningún pago.','Invii solo una richiesta. Su questo sito non viene effettuato alcun pagamento.'),
 eName:T('Please enter your name.','Bitte geben Sie Ihren Namen ein.','Lütfen adınızı girin.','Veuillez saisir votre nom.','Introduce tu nombre.','Inserisci il tuo nome.'),
 eEmail:T('Please enter a valid email address.','Bitte geben Sie eine gültige E-Mail-Adresse ein.','Lütfen geçerli bir e-posta adresi girin.','Veuillez saisir une adresse e-mail valide.','Introduce un correo electrónico válido.','Inserisci un indirizzo e-mail valido.'),
 eAcct:T('Please enter the username or email of the account you want to renew.','Bitte geben Sie den Benutzernamen oder die E-Mail-Adresse des Kontos ein, das Sie verlängern möchten.','Lütfen yenilemek istediğiniz hesabın kullanıcı adını veya e-posta adresini girin.','Veuillez indiquer l’identifiant ou l’e-mail du compte à renouveler.','Introduce el usuario o el correo de la cuenta que quieres renovar.','Inserisci il nome utente o l’e-mail dell’account da rinnovare.'),
 eCaptcha:T('Please complete the security check, then press Submit Request again.','Bitte schließen Sie die Sicherheitsprüfung ab und tippen Sie dann erneut auf „Anfrage senden“.','Lütfen güvenlik doğrulamasını tamamlayın, ardından yeniden “Talebi gönder”e basın.','Veuillez effectuer la vérification de sécurité, puis appuyez à nouveau sur « Envoyer la demande ».','Completa la comprobación de seguridad y vuelve a pulsar «Enviar solicitud».','Completa il controllo di sicurezza, poi premi di nuovo «Invia richiesta».'),
 eExpired:T('The security check expired. Please complete it again.','Die Sicherheitsprüfung ist abgelaufen. Bitte wiederholen Sie sie.','Güvenlik doğrulamasının süresi doldu. Lütfen tekrar tamamlayın.','La vérification de sécurité a expiré. Veuillez la refaire.','La comprobación de seguridad ha caducado. Complétala de nuevo.','Il controllo di sicurezza è scaduto. Completalo di nuovo.'),
 eCaptchaBad:T('The security check could not be confirmed. Please complete it again and resubmit.','Die Sicherheitsprüfung konnte nicht bestätigt werden. Bitte wiederholen Sie sie und senden Sie erneut.','Güvenlik doğrulaması onaylanamadı. Lütfen tekrar tamamlayıp yeniden gönderin.','La vérification de sécurité n’a pas pu être confirmée. Refaites-la et renvoyez la demande.','No se pudo confirmar la comprobación de seguridad. Complétala de nuevo y vuelve a enviar.','Non è stato possibile confermare il controllo di sicurezza. Completalo di nuovo e reinvia.'),
 eRate:T('Too many requests were sent from this connection. Please try again later, or message us on WhatsApp or Telegram.','Von dieser Verbindung wurden zu viele Anfragen gesendet. Bitte versuchen Sie es später erneut oder schreiben Sie uns über WhatsApp oder Telegram.','Bu bağlantıdan çok fazla talep gönderildi. Lütfen daha sonra tekrar deneyin veya bize WhatsApp ya da Telegram’dan yazın.','Trop de demandes ont été envoyées depuis cette connexion. Réessayez plus tard ou écrivez-nous sur WhatsApp ou Telegram.','Se han enviado demasiadas solicitudes desde esta conexión. Inténtalo más tarde o escríbenos por WhatsApp o Telegram.','Sono state inviate troppe richieste da questa connessione. Riprova più tardi o scrivici su WhatsApp o Telegram.'),
 ePlan:T('That plan is not available right now. Please choose another one.','Dieser Tarif ist derzeit nicht verfügbar. Bitte wählen Sie einen anderen.','Bu paket şu anda mevcut değil. Lütfen başka bir paket seçin.','Cette offre n’est pas disponible pour le moment. Veuillez en choisir une autre.','Ese plan no está disponible ahora. Elige otro.','Questo piano non è disponibile al momento. Scegline un altro.'),
 eSave:T('We couldn’t save your request. Your plan and details are still filled in, so you can try again. If it keeps failing, message us on WhatsApp or Telegram.','Ihre Anfrage konnte nicht gespeichert werden. Tarif und Angaben bleiben ausgefüllt, Sie können es also erneut versuchen. Klappt es weiterhin nicht, schreiben Sie uns über WhatsApp oder Telegram.','Talebiniz kaydedilemedi. Paketiniz ve bilgileriniz formda duruyor, tekrar deneyebilirsiniz. Sorun devam ederse bize WhatsApp veya Telegram’dan yazın.','Nous n’avons pas pu enregistrer votre demande. Votre offre et vos coordonnées sont conservées : vous pouvez réessayer. Si le problème persiste, écrivez-nous sur WhatsApp ou Telegram.','No hemos podido guardar tu solicitud. Tu plan y tus datos siguen rellenados, así que puedes volver a intentarlo. Si sigue fallando, escríbenos por WhatsApp o Telegram.','Non siamo riusciti a salvare la richiesta. Piano e dati restano compilati, quindi puoi riprovare. Se il problema continua, scrivici su WhatsApp o Telegram.'),
 doneH:T('Your request has been received','Ihre Anfrage ist eingegangen','Talebiniz alındı','Votre demande a bien été reçue','Hemos recibido tu solicitud','Abbiamo ricevuto la tua richiesta'),
 doneP:T('Your request is saved and our team can see it. To continue, send us the message below on WhatsApp or Telegram.','Ihre Anfrage ist gespeichert und für unser Team sichtbar. Senden Sie uns zum Fortfahren die Nachricht unten über WhatsApp oder Telegram.','Talebiniz kaydedildi ve ekibimiz tarafından görülebiliyor. Devam etmek için aşağıdaki mesajı bize WhatsApp veya Telegram’dan gönderin.','Votre demande est enregistrée et visible par notre équipe. Pour continuer, envoyez-nous le message ci-dessous sur WhatsApp ou Telegram.','Tu solicitud está guardada y nuestro equipo ya puede verla. Para continuar, envíanos el mensaje de abajo por WhatsApp o Telegram.','La richiesta è salvata e il nostro team può vederla. Per continuare, inviaci il messaggio qui sotto su WhatsApp o Telegram.'),
 dupP:T('You already have an open request for this plan, so we kept that one instead of creating a second. To continue, send us the message below on WhatsApp or Telegram.','Sie haben für diesen Tarif bereits eine offene Anfrage, daher haben wir keine zweite angelegt. Senden Sie uns zum Fortfahren die Nachricht unten über WhatsApp oder Telegram.','Bu paket için zaten açık bir talebiniz var, bu yüzden ikinci bir talep oluşturmadık. Devam etmek için aşağıdaki mesajı bize WhatsApp veya Telegram’dan gönderin.','Vous avez déjà une demande en cours pour cette offre, nous n’en avons donc pas créé de deuxième. Pour continuer, envoyez-nous le message ci-dessous sur WhatsApp ou Telegram.','Ya tienes una solicitud abierta para este plan, así que no hemos creado otra. Para continuar, envíanos el mensaje de abajo por WhatsApp o Telegram.','Hai già una richiesta aperta per questo piano, quindi non ne abbiamo creata una seconda. Per continuare, inviaci il messaggio qui sotto su WhatsApp o Telegram.'),
 offH:T('Send your request to our team','Senden Sie Ihre Anfrage an unser Team','Talebinizi ekibimize gönderin','Envoyez votre demande à notre équipe','Envía tu solicitud a nuestro equipo','Invia la richiesta al nostro team'),
 offP:T('Online requests aren’t available right now, so this request has not been saved. Send us the message below on WhatsApp or Telegram and our team will help you directly.','Online-Anfragen sind gerade nicht verfügbar, daher wurde diese Anfrage nicht gespeichert. Senden Sie uns die Nachricht unten über WhatsApp oder Telegram, dann hilft Ihnen unser Team direkt.','Çevrimiçi talepler şu anda kullanılamıyor, bu nedenle bu talep kaydedilmedi. Aşağıdaki mesajı bize WhatsApp veya Telegram’dan gönderin, ekibimiz size doğrudan yardımcı olsun.','Les demandes en ligne ne sont pas disponibles pour le moment : cette demande n’a donc pas été enregistrée. Envoyez-nous le message ci-dessous sur WhatsApp ou Telegram et notre équipe vous aidera directement.','Las solicitudes en línea no están disponibles ahora mismo, así que esta solicitud no se ha guardado. Envíanos el mensaje de abajo por WhatsApp o Telegram y nuestro equipo te ayudará directamente.','Le richieste online non sono disponibili al momento, quindi questa richiesta non è stata salvata. Inviaci il messaggio qui sotto su WhatsApp o Telegram e il nostro team ti aiuterà direttamente.'),
 ref:T('Reference','Referenz','Referans','Référence','Referencia','Riferimento'),
 stepH:T('Continue on WhatsApp or Telegram','Weiter über WhatsApp oder Telegram','WhatsApp veya Telegram’dan devam edin','Continuez sur WhatsApp ou Telegram','Continúa por WhatsApp o Telegram','Continua su WhatsApp o Telegram'),
 stepP:T('Tap WhatsApp or Telegram below. We copy the message for you, so you only need to paste it into the chat and send it.','Tippen Sie unten auf WhatsApp oder Telegram. Wir kopieren die Nachricht für Sie, Sie müssen sie nur im Chat einfügen und senden.','Aşağıdan WhatsApp veya Telegram’a dokunun. Mesajı sizin için kopyalarız; sohbete yapıştırıp göndermeniz yeterli.','Touchez WhatsApp ou Telegram ci-dessous. Nous copions le message pour vous : il vous suffit de le coller dans la conversation et de l’envoyer.','Pulsa WhatsApp o Telegram abajo. Copiamos el mensaje por ti; solo tienes que pegarlo en el chat y enviarlo.','Tocca WhatsApp o Telegram qui sotto. Copiamo il messaggio per te: devi solo incollarlo nella chat e inviarlo.'),
 msgL:T('Your message','Ihre Nachricht','Mesajınız','Votre message','Tu mensaje','Il tuo messaggio'),
 copy:T('Copy Message','Nachricht kopieren','Mesajı kopyala','Copier le message','Copiar mensaje','Copia messaggio'),
 copied:T('Message copied.','Nachricht kopiert.','Mesaj kopyalandı.','Message copié.','Mensaje copiado.','Messaggio copiato.'),
 copiedApp:T('Message copied. Paste it into the {app} chat and send it.','Nachricht kopiert. Fügen Sie sie im {app}-Chat ein und senden Sie sie.','Mesaj kopyalandı. {app} sohbetine yapıştırıp gönderin.','Message copié. Collez-le dans la conversation {app} et envoyez-le.','Mensaje copiado. Pégalo en el chat de {app} y envíalo.','Messaggio copiato. Incollalo nella chat di {app} e invialo.'),
 copyFail:T('Couldn’t copy automatically. Select the message above and copy it manually.','Automatisches Kopieren nicht möglich. Markieren Sie die Nachricht oben und kopieren Sie sie manuell.','Otomatik kopyalanamadı. Yukarıdaki mesajı seçip elle kopyalayın.','Copie automatique impossible. Sélectionnez le message ci-dessus et copiez-le manuellement.','No se pudo copiar automáticamente. Selecciona el mensaje de arriba y cópialo a mano.','Impossibile copiare automaticamente. Seleziona il messaggio qui sopra e copialo a mano.'),
 wa:T('Open WhatsApp','WhatsApp öffnen','WhatsApp’ı aç','Ouvrir WhatsApp','Abrir WhatsApp','Apri WhatsApp'),
 tg:T('Open Telegram','Telegram öffnen','Telegram’ı aç','Ouvrir Telegram','Abrir Telegram','Apri Telegram'),
 pending:T('Nothing has been paid yet. Your request stays pending until our team confirms the payment with you in chat.','Es wurde noch nichts bezahlt. Ihre Anfrage bleibt offen, bis unser Team die Zahlung im Chat mit Ihnen bestätigt.','Henüz bir ödeme yapılmadı. Ekibimiz ödemeyi sohbette sizinle onaylayana kadar talebiniz beklemede kalır.','Rien n’a encore été payé. Votre demande reste en attente jusqu’à ce que notre équipe confirme le paiement avec vous dans la conversation.','Todavía no se ha pagado nada. Tu solicitud queda pendiente hasta que nuestro equipo confirme el pago contigo en el chat.','Non è stato ancora pagato nulla. La richiesta resta in attesa finché il nostro team non conferma con te il pagamento in chat.'),
 toSite:T('Back to website','Zurück zur Website','Web sitesine dön','Retour au site','Volver a la web','Torna al sito'),
 edit:T('Edit my request','Anfrage bearbeiten','Talebimi düzenle','Modifier ma demande','Editar mi solicitud','Modifica la richiesta'),
 lName:T('Name','Name','Ad','Nom','Nombre','Nome'),
 lEmail:T('Email','E-Mail','E-posta','E-mail','Correo','E-mail'),
 lMsg:T('Message','Nachricht','Mesaj','Message','Mensaje','Messaggio'),
 mSaved_purchase:T('Hello Tellyro! I’ve submitted a purchase request.','Hallo Tellyro! Ich habe eine Kaufanfrage gesendet.','Merhaba Tellyro! Bir satın alma talebi gönderdim.','Bonjour Tellyro ! J’ai envoyé une demande d’achat.','¡Hola, Tellyro! He enviado una solicitud de compra.','Ciao Tellyro! Ho inviato una richiesta di acquisto.'),
 mSaved_renewal:T('Hello Tellyro! I’ve submitted a renewal request.','Hallo Tellyro! Ich habe eine Verlängerungsanfrage gesendet.','Merhaba Tellyro! Bir yenileme talebi gönderdim.','Bonjour Tellyro ! J’ai envoyé une demande de renouvellement.','¡Hola, Tellyro! He enviado una solicitud de renovación.','Ciao Tellyro! Ho inviato una richiesta di rinnovo.'),
 mNew_purchase:T('Hello Tellyro! I’d like to purchase a plan.','Hallo Tellyro! Ich möchte einen Tarif kaufen.','Merhaba Tellyro! Bir paket satın almak istiyorum.','Bonjour Tellyro ! J’aimerais acheter une offre.','¡Hola, Tellyro! Me gustaría comprar un plan.','Ciao Tellyro! Vorrei acquistare un piano.'),
 mNew_renewal:T('Hello Tellyro! I’d like to renew my plan.','Hallo Tellyro! Ich möchte meinen Tarif verlängern.','Merhaba Tellyro! Paketimi yenilemek istiyorum.','Bonjour Tellyro ! J’aimerais renouveler mon offre.','¡Hola, Tellyro! Me gustaría renovar mi plan.','Ciao Tellyro! Vorrei rinnovare il mio piano.'),
 mEnd:T('Please help me arrange payment. Thank you!','Bitte helfen Sie mir bei der Zahlung. Vielen Dank!','Ödeme konusunda yardımcı olur musunuz? Teşekkürler!','Pouvez-vous m’aider à organiser le paiement ? Merci !','¿Me ayudáis a organizar el pago? ¡Gracias!','Potete aiutarmi a organizzare il pagamento? Grazie!')};
const UNITS={en:[['device','devices'],['month','months']],de:[['Gerät','Geräte'],['Monat','Monate']],tr:[['cihaz','cihaz'],['ay','ay']],fr:[['appareil','appareils'],['mois','mois']],es:[['dispositivo','dispositivos'],['mes','meses']],it:[['dispositivo','dispositivi'],['mese','mesi']]};
const ICON={check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',
 chat:'<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9.5h8M8 12.5h5"/>',
 clock:'<circle cx="12" cy="12" r="9.5"/><path d="M12 7v5l3.5 2"/>',
 warn:'<path d="M12 3 2.5 20h19z"/><path d="M12 10v4.5M12 17.2v.1"/>',
 copy:'<rect x="8.5" y="8.5" width="12" height="12" rx="2"/><path d="M15.5 8.5V5a1.5 1.5 0 0 0-1.5-1.5H5A1.5 1.5 0 0 0 3.5 5v9A1.5 1.5 0 0 0 5 15.5h3.5"/>',
 wa:'<path d="M3.5 20.5l1.3-4.2A8.5 8.5 0 1 1 8 19.4z"/><path d="M9 8.5c0 3.4 2.9 6.5 6.5 6.6l1.2-1.6-2.1-1-1 .9c-1-.4-2.3-1.6-2.8-2.7l.9-1-.9-2.2z"/>',
 tg:'<path d="M21 4 2.8 11.2l6 2.1L18 7l-7.2 7.6.1 5.4 3-3.6 4.5 3.3z"/>',
 home:'<path d="M3.5 11 12 4l8.5 7"/><path d="M6 9.5V20h12V9.5"/>',
 edit:'<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>'};
const svg=k=>`<svg viewBox="0 0 24 24" aria-hidden="true">${ICON[k]}</svg>`;
const $=s=>document.querySelector(s),form=$('#o-form'),sel=$('#o-lang');
const el=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=text;return e};
let lang='en';
const tx=k=>(S[k]&&(S[k][lang]||S[k].en))||'';
const unit=(n,i)=>n+' '+UNITS[lang][i][n===1?0:1];
const planText=(d,m)=>unit(d,0)+' · '+unit(m,1);
const money=n=>'$'+n.toFixed(2);
const clean=s=>s.replace(/\s+/g,' ').trim();
const EMAIL=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const safeUrl=u=>{try{const x=new URL(u);return x.protocol=='https:'?x.href:null}catch{return null}};
// wa.me/<number> links accept prefilled text; wa.me/message/<code> links don't, so the message is copied instead.
const waChatUrl=msg=>{const u=safeUrl(C.whatsapp);return u&&/^https:\/\/wa\.me\/\d+\/?$/.test(u)?u.replace(/\/$/,'')+'?text='+encodeURIComponent(msg):u};
function copyText(text){if(navigator.clipboard&&window.isSecureContext)return navigator.clipboard.writeText(text);return new Promise((ok,no)=>{const t=document.createElement('textarea');t.value=text;t.setAttribute('readonly','');t.style.cssText='position:fixed;opacity:0;top:0';document.body.append(t);t.select();try{document.execCommand('copy')?ok():no()}catch(e){no(e)}t.remove()})}
const ready=()=>/^(https:\/\/[a-z0-9.-]+\.[a-z]{2,}|http:\/\/(localhost|127\.0\.0\.1)(:\d+)?)\/?$/i.test(C.supabaseUrl||'')
 &&!!C.supabaseAnonKey&&!/YOUR_|PLACEHOLDER/i.test(C.supabaseAnonKey)&&!!C.turnstileSiteKey&&!/YOUR_|PLACEHOLDER/i.test(C.turnstileSiteKey);

/* State: the plan comes from the pricing page link (?type=&devices=&months=) and stays in the URL. */
const qs=new URLSearchParams(location.search),num=(v,list,def)=>list.includes(Number(v))?Number(v):def;
const st={type:qs.get('type')==='renewal'?'renewal':'purchase',devices:num(qs.get('devices'),P.devices,1),months:num(qs.get('months'),P.months,12)};
const price=()=>P.prices[st.devices][st.months];
let busy=false,errKey='',errDetail='',lastDone=null;

function opt(name,value,cls,kids){const l=el('label','opt'+(cls?' '+cls:'')),i=el('input');i.type='radio';i.name=name;i.value=String(value);i.checked=st[name]===value;l.append(i,...kids);return l}
function drawPicker(){
 $('#o-devices').replaceChildren(...P.devices.map(d=>opt('devices',d,'',[el('span',0,unit(d,0))])));
 $('#o-months').replaceChildren(...P.months.map(m=>{const kids=[el('b',0,unit(m,1)),el('span','dp')];if(m===P.months[P.months.length-1])kids.push(el('small','tag',tx('best')));return opt('months',m,'dur',kids)}));
 form.querySelectorAll('[name=type]').forEach(r=>{r.checked=r.value===st.type});
}
function update(){
 document.querySelectorAll('#o-months .dur').forEach(l=>{l.querySelector('.dp').textContent=money(P.prices[st.devices][Number(l.querySelector('input').value)])});
 $('#s-type').textContent=tx(st.type);$('#s-plan').textContent=planText(st.devices,st.months);$('#s-price').textContent=money(price());
 $('#w-acct').hidden=st.type!=='renewal';
 const u=new URL(location.href);u.searchParams.set('type',st.type);u.searchParams.set('devices',st.devices);u.searchParams.set('months',st.months);history.replaceState(null,'',u);
}
form.addEventListener('change',e=>{const n=e.target.name;if(!(n in st))return;st[n]=n==='type'?e.target.value:Number(e.target.value);
 if(n==='type')setFieldErr('acct','');update()});

/* Field and form errors keep their message key so a language change re-translates them. */
function setFieldErr(k,key){const e=$('#e-'+k),i=$('#o-'+k);e.dataset.k=key||'';e.textContent=key?tx(key):'';i.setAttribute('aria-invalid',key?'true':'false')}
['name','email','acct'].forEach(k=>$('#o-'+k).addEventListener('input',()=>{if($('#e-'+k).dataset.k)setFieldErr(k,'')}));
function showErr(key,detail){errKey=key||'';errDetail=detail||'';const b=$('#o-err');b.replaceChildren();b.hidden=!key;if(!key)return;
 b.innerHTML=svg('warn');const t=el('div');t.append(el('span',0,tx(key)));if(detail)t.append(el('span','detail',detail));b.append(t)}
function validate(){
 const name=clean($('#o-name').value),email=$('#o-email').value.trim().toLowerCase(),acct=clean($('#o-acct').value),renew=st.type==='renewal';
 const errs=[['name',name.length<2?'eName':''],['email',EMAIL.test(email)?'':'eEmail'],['acct',renew&&acct.length<2?'eAcct':'']];
 errs.forEach(([k,e])=>setFieldErr(k,e));const bad=errs.find(([,e])=>e);
 if(bad){$('#o-'+bad[0]).focus();return null}
 return {...st,name,email,account:renew?acct:'',message:clean($('#o-msg').value),price:price()};
}
function setBusy(on){busy=on;const b=$('#o-submit');b.disabled=on;b.setAttribute('aria-busy',String(on));
 b.replaceChildren();if(on)b.append(el('span','spin'));const t=el('span',0,tx(on?'sending':'submit'));t.id='o-submit-t';b.append(t)}

/* Turnstile: loaded only when the backend is configured with a real public site key. */
let wid=null,secErr=false;
function startVerification(){if(!ready())return;const box=$('#o-ts');box.hidden=false;
 const sc=document.createElement('script');sc.src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';sc.async=true;
 sc.onload=()=>{try{if(!window.turnstile)throw Error('unavailable');
  wid=window.turnstile.render(box,{sitekey:C.turnstileSiteKey,theme:'dark',language:lang,size:box.clientWidth<300?'compact':'normal',
   'error-callback':()=>{secErr=true},'expired-callback':()=>showErr('eExpired')})}catch{secErr=true;box.hidden=true}};
 sc.onerror=()=>{secErr=true;box.hidden=true};document.head.append(sc)}
const token=()=>{try{return wid!=null&&window.turnstile?window.turnstile.getResponse(wid)||'':''}catch{return ''}};
const resetTs=()=>{try{if(wid!=null&&window.turnstile)window.turnstile.reset(wid)}catch{}};

const FIELD={invalid_name:['name','eName'],invalid_email:['email','eEmail'],invalid_account:['acct','eAcct']};
form.addEventListener('submit',async e=>{
 e.preventDefault();if(busy)return; // one request at a time: double clicks and repeated Enter are ignored
 showErr('');const v=validate();if(!v)return;
 if(!ready()){showDone(v,{saved:false});return} // backend not configured: nothing is saved, so the customer sends it via chat
 const tk=token();
 if(!tk){if(secErr||wid==null)showDone(v,{saved:false});else{showErr('eCaptcha');$('#o-ts').scrollIntoView({block:'center',behavior:'smooth'})}return}
 setBusy(true);
 try{
  const r=await fetch(C.supabaseUrl.replace(/\/$/,'')+'/functions/v1/purchase-request',{method:'POST',headers:{'content-type':'application/json','apikey':C.supabaseAnonKey},
   body:JSON.stringify({request_type:v.type,name:v.name,email:v.email,devices:v.devices,months:v.months,account_reference:v.account,message:v.message,turnstile:tk})});
  let j={};try{j=await r.json()}catch{}
  if(r.status===503){showDone(v,{saved:false});return} // requests paused in the dashboard: nothing was saved
  if(!r.ok||!j.ok){const x=Error(j.error||'HTTP '+r.status);x.code=j.code;throw x}
  const ref=[j.reference,j.id].find(x=>typeof x=='string'&&x.trim());
  showDone(v,{saved:true,duplicate:!!j.duplicate,ref:ref?ref.trim():'',price:Number.isFinite(j.price_cents)?j.price_cents/100:v.price});
 }catch(x){
  // everything the customer entered stays in the form; the token is single-use, so it is reset for the retry
  resetTs();const f=FIELD[x.code];
  if(f){setFieldErr(f[0],f[1]);$('#o-'+f[0]).focus();return}
  const k={invalid_plan:'ePlan',captcha_failed:'eCaptchaBad',rate_limited:'eRate'}[x.code]||'eSave';
  showErr(k,k==='eSave'?x.message:'');$('#o-err').scrollIntoView({block:'center',behavior:'smooth'});
 }finally{setBusy(false)}
});

/* Confirmation. "saved" is true only after the backend confirmed it stored the request. */
function message(v,o){const L=[tx((o.saved?'mSaved_':'mNew_')+v.type),''];if(o.ref)L.push(tx('ref')+': '+o.ref);
 L.push(tx('lName')+': '+v.name,tx('lEmail')+': '+v.email,tx('plan')+': '+planText(v.devices,v.months)+' ('+money(o.price??v.price)+' USD)');
 if(v.account)L.push(tx('acct')+': '+v.account);if(v.message)L.push(tx('lMsg')+': '+v.message);
 L.push('',tx('mEnd'));return L.join('\n')}
function iconBtn(tag,cls,icon,label){const b=el(tag,cls);b.innerHTML=svg(icon);b.append(el('span',0,label));return b}
function renderDone(){const {v,o}=lastDone,box=$('#o-done'),msg=message(v,o);
 const head=el('div','done-head'),ic=el('span','done-ic'+(o.saved?'':' wait'));ic.innerHTML=svg(o.saved?'check':'chat');
 const h=el('h2',0,tx(o.saved?'doneH':'offH'));h.id='o-done-h';head.append(ic,h);box.setAttribute('aria-labelledby','o-done-h');
 const parts=[head,el('p','done-lead',tx(o.saved?(o.duplicate?'dupP':'doneP'):'offP'))];
 if(o.ref){const r=el('p','ref');r.append(el('span',0,tx('ref')),el('b',0,o.ref));parts.push(r)}
 const dl=el('dl','sum'),row=(k,val)=>{const d=el('div');d.append(el('dt',0,tx(k)),el('dd',0,val));dl.append(d)};
 row('type',tx(v.type));row('plan',planText(v.devices,v.months));row('total',money(o.price??v.price)+' USD');if(v.account)row('acct',v.account);
 parts.push(dl,el('h3','step-h',tx('stepH')),el('p','step-p',tx('stepP')));
 const lab=el('p','msg-l',tx('msgL'));lab.id='o-msg-l';const pre=el('pre','msgbox',msg);pre.id='o-message';pre.tabIndex=0;pre.setAttribute('aria-labelledby','o-msg-l');
 const status=el('p','status');status.setAttribute('role','status');
 const say=(ok,app)=>{status.textContent=ok?(app?tx('copiedApp').replace('{app}',app):tx('copied')):tx('copyFail');status.className='status'+(ok?' ok':'');
  if(!ok){const r=document.createRange();r.selectNodeContents(pre);const s=getSelection();s.removeAllRanges();s.addRange(r)}};
 const cp=iconBtn('button','btn navy','copy',tx('copy'));cp.type='button';cp.id='o-copy';cp.onclick=()=>copyText(msg).then(()=>say(true),()=>say(false));
 const acts=el('div','acts');acts.append(cp);
 [['wa','btn p',waChatUrl(msg),'WhatsApp'],['tg','btn navy',safeUrl(C.telegram),'Telegram']].forEach(([k,cls,href,app])=>{if(!href)return;
  const a=iconBtn('a',cls,k,tx(k));a.href=href;a.target='_blank';a.rel='noopener noreferrer';a.addEventListener('click',()=>copyText(msg).then(()=>say(true,app),()=>say(false)));acts.append(a)});
 parts.push(lab,pre,acts,status);
 if(o.saved){const n=el('p','pend');n.innerHTML=svg('clock');n.append(el('span',0,tx('pending')));parts.push(n)}
 const foot=el('div','done-foot');
 if(!o.saved){const ed=iconBtn('button','btn navy','edit',tx('edit'));ed.type='button';ed.onclick=showForm;foot.append(ed)}
 const home=iconBtn('a','btn','home',tx('toSite'));home.href='index.html';foot.append(home);parts.push(foot);
 box.replaceChildren(...parts)}
function showDone(v,o){lastDone={v,o};renderDone();form.hidden=true;$('#o-hero').hidden=true;const box=$('#o-done');box.hidden=false;
 scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth'});box.focus({preventScroll:true})}
function showForm(){lastDone=null;$('#o-done').hidden=true;$('#o-hero').hidden=false;form.hidden=false;$('#o-submit').focus()}

function render(){lang=LANGS.includes(sel.value)?sel.value:'en';document.documentElement.lang=lang;try{localStorage.setItem('tellyro-lang',lang)}catch{}
 document.querySelectorAll('[data-t]').forEach(e=>{const v=tx(e.dataset.t);if(v)e.textContent=v});document.title=tx('title');
 drawPicker();update();
 document.querySelectorAll('.err').forEach(e=>{e.textContent=e.dataset.k?tx(e.dataset.k):''});
 setBusy(busy);showErr(errKey,errDetail);if(lastDone)renderDone()}
if(!ready())$('.next li').dataset.t='next1off';
let first=qs.get('lang');if(!LANGS.includes(first)){try{first=localStorage.getItem('tellyro-lang')||(navigator.language||'').slice(0,2).toLowerCase()}catch{}}
sel.value=LANGS.includes(first)?first:'en';
sel.addEventListener('change',()=>{render();const u=new URL(location.href);u.searchParams.set('lang',lang);history.replaceState(null,'',u)});
render();startVerification();
})();
