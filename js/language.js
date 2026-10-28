(() => {
    const LANGUAGE_KEY = "helemays.language.v1";
    const languages = ["en", "fr", "tw", "yo"];
    const languageNames = { en: "English", fr: "Français", tw: "Twi", yo: "Yorùbá" };
    const rows = [
        ["Home", "Accueil", "Fie", "Ilé"],
        ["My Orders", "Mes commandes", "Me nneɛma a maka ho mmara", "Àwọn àṣẹ mi"],
        ["Orders", "Commandes", "Nneɛma a wɔatɔ", "Àwọn àṣẹ"],
        ["Search", "Rechercher", "Hwehwɛ", "Wá kiri"],
        ["Cart", "Panier", "Kɛntɛn", "Agbọn"],
        ["My Account", "Mon compte", "Me akawnt", "Àkọọ́lẹ̀ mi"],
        ["Account", "Compte", "Akawnt", "Àkọọ́lẹ̀"],
        ["Sign in", "Se connecter", "Hyɛ mu", "Wọlé"],
        ["Sign out", "Se déconnecter", "Fi akawnt no mu", "Jáde"],
        ["Support", "Assistance", "Mmoa", "Ìrànlọ́wọ́"],
        ["Back to store", "Retour à la boutique", "San kɔ sotɔɔ no mu", "Padà sí ilé ìtajà"],
        ["Visit store", "Visiter la boutique", "Kɔ sotɔɔ no mu", "Ṣèbẹ̀wò sí ilé ìtajà"],
        ["Continue shopping", "Continuer vos achats", "Kɔ so tɔ nneɛma", "Tẹ̀síwájú ní ríra"],
        ["View all", "Tout voir", "Hwɛ ne nyinaa", "Wo gbogbo rẹ̀"],
        ["View All", "Tout voir", "Hwɛ ne nyinaa", "Wo gbogbo rẹ̀"],
        ["View All Shoes", "Voir toutes les chaussures", "Hwɛ mpaboa nyinaa", "Wo gbogbo bàtà"],
        ["View Product", "Voir le produit", "Hwɛ ade no", "Wo ọjà náà"],
        ["View Details", "Voir les détails", "Hwɛ nsɛm no", "Wo àlàyé"],
        ["Add to Cart", "Ajouter au panier", "Fa gu kɛntɛn mu", "Fi kún agbọn"],
        ["Added!", "Ajouté !", "Wɔde aka ho!", "A ti fi kún un!"],
        ["Your Cart", "Votre panier", "Wo kɛntɛn", "Agbọn rẹ"],
        ["Your Shopping Bag", "Votre sac", "Wo nneɛma kɛntɛn", "Àpò ìrà rẹ"],
        ["Your bag is empty.", "Votre panier est vide.", "Wo kɛntɛn no mu yɛ hunu.", "Agbọn rẹ ṣófo."],
        ["Order total", "Total de la commande", "Nneɛma a wɔatɔ nyinaa bo", "Àpapọ̀ owó àṣẹ"],
        ["Cart total", "Total du panier", "Kɛntɛn no nyinaa bo", "Àpapọ̀ owó agbọn"],
        ["Checkout", "Paiement", "Tua ka", "San owó"],
        ["Your details", "Vos coordonnées", "Wo ho nsɛm", "Àlàyé rẹ"],
        ["Confirmation", "Confirmation", "Nsi so dua", "Ìmúdájú"],
        ["Review order", "Vérifier la commande", "Hwɛ nneɛma a woatɔ no", "Ṣàyẹ̀wò àṣẹ"],
        ["Secure Checkout", "Paiement sécurisé", "Tua ka wɔ ahobammɔ mu", "Ìsanwó tó ní ààbò"],
        ["Complete your order", "Finaliser votre commande", "Wie wo nneɛma a woatɔ no", "Parí àṣẹ rẹ"],
        ["Contact details", "Coordonnées", "Nkitahodi ho nsɛm", "Àlàyé ìbánisọ̀rọ̀"],
        ["Full name", "Nom complet", "Din nyinaa", "Orúkọ kíkún"],
        ["Name", "Nom", "Din", "Orúkọ"],
        ["Phone", "Téléphone", "Foonu", "Fóònù"],
        ["Phone number", "Numéro de téléphone", "Foonu nɔma", "Nọ́mbà fóònù"],
        ["Email address", "Adresse e-mail", "Email adrɛs", "Àdírẹ́sì í-meèlì"],
        ["Password", "Mot de passe", "Pɛsɔwɔde", "Ọ̀rọ̀ aṣínà"],
        ["Forgot password?", "Mot de passe oublié ?", "Wo werɛ afi wo pɛsɔwɔde?", "Ṣé o gbàgbé ọ̀rọ̀ aṣínà?"],
        ["Create account", "Créer un compte", "Yɛ akawnt foforo", "Ṣẹ̀dá àkọọ́lẹ̀"],
        ["Welcome back", "Bon retour", "Yɛma wo akwaaba bio", "Ẹ káàbọ̀ padà"],
        ["Customer", "Client", "Ɔdetɔ", "Oníbàárà"],
        ["Address", "Adresse", "Adrɛs", "Àdírẹ́sì"],
        ["Delivery", "Livraison", "De ma", "Ìfijiṣẹ́"],
        ["Payment", "Paiement", "Tua ka", "Ìsanwó"],
        ["Payment method", "Mode de paiement", "Ɔkwan a wɔbɛfa so atua ka", "Ọ̀nà ìsanwó"],
        ["Cash", "Espèces", "Sika sika", "Owó gidi"],
        ["Pay on delivery", "Payer à la livraison", "Tua ka bere a wɔde bɛbrɛ wo", "Sanwó nígbà tí wọ́n bá fi dé"],
        ["Mobile Money", "Argent mobile", "Mobile Money", "Owó fóònù"],
        ["Order note", "Note de commande", "Nneɛma a wopɛ sɛ wokae", "Àkọsílẹ̀ àṣẹ"],
        ["Optional note", "Note facultative", "Nsɛm foforo (sɛ wopɛ)", "Àkọsílẹ̀ àfikún"],
        ["Subtotal", "Sous-total", "Nneɛma no bo ansa na wɔde aka ho", "Àpapọ̀ kékeré"],
        ["Total", "Total", "Ne nyinaa", "Àpapọ̀"],
        ["Almost there", "Presque terminé", "Woawie kakra", "Ó fẹ́rẹ̀ tán"],
        ["Send order", "Envoyer la commande", "Fa kɔ", "Fi àṣẹ ránṣẹ́"],
        ["Back to checkout", "Retour au paiement", "San kɔ tua ka", "Padà sí ìsanwó"],
        ["Order number", "Numéro de commande", "Nneɛma a wɔatɔ no nɔma", "Nọ́mbà àṣẹ"],
        ["Secure", "Sécurisé", "Ahobammɔ wɔ mu", "Ó ní ààbò"],
        ["My account", "Mon compte", "Me akawnt", "Àkọọ́lẹ̀ mi"],
        ["Overview", "Vue d’ensemble", "Nhwehwɛmu", "Àkótán"],
        ["Messages", "Messages", "Nkrasɛm", "Àwọn ìránṣẹ́"],
        ["Account details", "Détails du compte", "Akawnt ho nsɛm", "Àlàyé àkọọ́lẹ̀"],
        ["Recent orders", "Commandes récentes", "Nneɛma a wɔatɔ nnansa yi", "Àwọn àṣẹ àìpẹ́"],
        ["Recent messages", "Messages récents", "Nkrasɛm a aba nnansa yi", "Àwọn ìránṣẹ́ àìpẹ́"],
        ["Order tracking", "Suivi de commande", "Nneɛma a wɔatɔ ho nhwehwɛmu", "Títẹ̀lé àṣẹ"],
        ["Track an order", "Suivre une commande", "Hwehwɛ nneɛma a woatɔ", "Tẹ̀lé àṣẹ"],
        ["Order support", "Assistance commande", "Mmoa a ɛfa nneɛma a wɔatɔ ho", "Ìrànlọ́wọ́ àṣẹ"],
        ["Message the store", "Écrire à la boutique", "Kyerɛw kɔma sotɔɔ no", "Fi ìránṣẹ́ ránṣẹ́ sí ilé ìtajà"],
        ["Private", "Privé", "Wɔde sie", "Ìkọ̀kọ̀"],
        ["New", "Nouveau", "Foforo", "Tuntun"],
        ["Confirmed", "Confirmée", "Wɔagye ato mu", "A fọwọ́sí"],
        ["Preparing", "En préparation", "Wɔresiesie", "Wọ́n ń pèsè"],
        ["Completed", "Terminée", "Ewie", "Parí"],
        ["Cancelled", "Annulée", "Wɔagyae", "Fagilé"],
        ["Not specified", "Non précisé", "Nkyerɛɛ", "A kò sọ"],
        ["Select an order", "Sélectionnez une commande", "Paw nneɛma a woatɔ", "Yan àṣẹ kan"],
        ["No tracked orders", "Aucune commande suivie", "Nneɛma a wɔahwehwɛ biara nni hɔ", "Kò sí àṣẹ tí a ń tọpinpin"],
        ["Orders placed on this device will appear here.", "Les commandes passées sur cet appareil apparaîtront ici.", "Nneɛma a wɔtɔ wɔ saa mfiri yi so bɛda ha.", "Àwọn àṣẹ tí a ṣe lórí ẹ̀rọ yìí yóò hàn níbí."],
        ["Your tracking details will appear here.", "Les détails du suivi apparaîtront ici.", "Wo nneɛma a wɔahwehwɛ ho nsɛm bɛda ha.", "Àlàyé ìtọpinpin rẹ yóò hàn níbí."],
        ["Could not load this order", "Impossible de charger cette commande", "Yɛantumi annya nneɛma a woatɔ yi", "A kò lè ṣí àṣẹ yìí"],
        ["Loading order", "Chargement de la commande", "Wɔretwe nneɛma a wɔatɔ no", "Ń gbé àṣẹ wọlé"],
        ["Order total", "Total de la commande", "Nneɛma a wɔatɔ nyinaa bo", "Àpapọ̀ owó àṣẹ"],
        ["Size", "Pointure", "Kɛseɛ", "Ìwọ̀n"],
        ["Qty", "Qté", "Dodow", "Iye"],
        ["Your orders, store messages and shopping bag are all here.", "Vos commandes, messages et panier sont réunis ici.", "Wo nneɛma a woatɔ, nkrasɛm ne kɛntɛn wɔ ha nyinaa.", "Àwọn àṣẹ rẹ, ìránṣẹ́ àti agbọn rẹ wà níbí."],
        ["No orders yet", "Aucune commande pour le moment", "Wonnya ntɔɔ biribiara", "Kò tíì sí àṣẹ kankan"],
        ["Your purchases will appear here after you place an order.", "Vos achats apparaîtront ici après votre commande.", "Sɛ wotɔ ade wie a, wo nneɛma bɛda ha.", "Àwọn ohun tí o rà yóò hàn níbí lẹ́yìn tí o bá ṣe àṣẹ."],
        ["No messages yet", "Aucun message pour le moment", "Nkrasɛm biara nnya mmae", "Kò tíì sí ìránṣẹ́ kankan"],
        ["Your cart is empty", "Votre panier est vide", "Wo kɛntɛn no mu yɛ hunu", "Agbọn rẹ ṣófo"],
        ["Your bag is empty", "Votre sac est vide", "Wo kɛntɛn no mu yɛ hunu", "Àpò rẹ ṣófo"],
        ["Your store account", "Votre compte boutique", "Wo sotɔɔ akawnt", "Àkọọ́lẹ̀ ilé ìtajà rẹ"],
        ["Your Account", "Votre compte", "Wo akawnt", "Àkọọ́lẹ̀ rẹ"],
        ["Your Store Activity", "Votre activité boutique", "Wo sotɔɔ dwumadi", "Ìṣe rẹ ní ilé ìtajà"],
        ["Personal information", "Informations personnelles", "Wo ankasa ho nsɛm", "Àlàyé ara ẹni"],
        ["Verified", "Vérifié", "Wɔagye atom", "A ti fìdí rẹ̀ múlẹ̀"],
        ["Refresh order status", "Actualiser le statut de la commande", "Yɛ nneɛma a woatɔ no tebea foforo", "Tún ipò àṣẹ ṣe"],
        ["Refresh activity", "Actualiser l’activité", "Yɛ dwumadi no foforo", "Tún ìṣe ṣe"],
        ["Select language", "Choisir la langue", "Paw kasa", "Yan èdè"],
        ["Handcrafted Footwear", "Chaussures artisanales", "Mpaboa a wɔde nsa ayɛ", "Bàtà ọwọ́ iṣẹ́ ọnà"],
        ["Handcrafted footwear", "Chaussures artisanales", "Mpaboa a wɔde nsa ayɛ", "Bàtà ọwọ́ iṣẹ́ ọnà"],
        ["Handcrafted in Ghana", "Fabriqué à la main au Ghana", "Wɔde nsa ayɛ wɔ Ghana", "A fi ọwọ́ ṣe ní Ghana"],
        ["Featured Shoes", "Chaussures à la une", "Mpaboa a wɔapaw", "Àwọn bàtà pàtàkì"],
        ["Our Collection", "Notre collection", "Yɛn nneɛma", "Àkójọpọ̀ wa"],
        ["OUR COLLECTION", "NOTRE COLLECTION", "YƐN NNEƐMA", "ÀKÓJỌPỌ̀ WA"],
        ["Shop the Collection", "Acheter la collection", "Tɔ nneɛma yi", "Ra àwọn ọjà yìí"],
        ["Find your perfect pair", "Trouvez la paire idéale", "Hwehwɛ mpaboa a ɛfata wo", "Wá bàtà tó bá ọ mu"],
        ["Explore handcrafted leather footwear designed for every occasion, every style and every step", "Découvrez des chaussures en cuir artisanales pour chaque occasion, chaque style et chaque pas.", "Hwehwɛ mpaboa a wɔde nhoma ayɛ ama mmere ne anammɔn biara.", "Ṣàwárí bàtà awọ tí a fi ọwọ́ ṣe fún gbogbo ìgbà àti gbogbo ìgbésẹ̀."],
        ["Discover our most loved handcrafted styles.", "Découvrez nos modèles artisanaux préférés.", "Hwehwɛ mpaboa a yɛn ani gye ho paa.", "Ṣàwárí àwọn àwòṣe ọwọ́ iṣẹ́ ọnà tí a fẹ́ràn jù."],
        ["Our footwear", "Nos chaussures", "Yɛn mpaboa", "Àwọn bàtà wa"],
        ["Formal", "Ville", "Ɛyɛ fɛ", "Tó bá àṣà mu"],
        ["Loafers", "Mocassins", "Mpaboa a wɔmfa ahama nhyehyɛ mu", "Bàtà aláìní okùn"],
        ["Slippers", "Sandales", "Mpaboa a ɛyɛ hare", "Bàtà rọrùn"],
        ["Boots", "Bottes", "Mpaboa atenten", "Bàtà gígùn"],
        ["Sandals", "Sandales", "Mpaboa a ɛbue", "Bàtà ẹsẹ̀ ṣíṣí"],
        ["Find us in Accra", "Retrouvez-nous à Accra", "Hwehwɛ yɛn wɔ Accra", "Wá bá wa ní Accra"],
        ["Get directions", "Itinéraire", "Kyerɛ ɔkwan", "Gba ìtọ́sọ́nà"],
        ["Contact", "Contact", "Nkitahodi", "Ìbánisọ̀rọ̀"],
        ["Contact the store", "Contacter la boutique", "Frɛ sotɔɔ no", "Kàn sí ilé ìtajà"],
        ["Help Center", "Centre d’aide", "Mmoa bea", "Ibi ìrànlọ́wọ́"],
        ["Help center", "Centre d’aide", "Mmoa bea", "Ibi ìrànlọ́wọ́"],
        ["Careers", "Carrières", "Adwuma", "Iṣẹ́"],
        ["Privacy Policy", "Politique de confidentialité", " koko asɛm ho banbɔ", "Ìlànà àṣírí"],
        ["Terms", "Conditions", "Mmara", "Àwọn òfin"],
        ["Terms of use", "Conditions d’utilisation", "Mmara a wɔde di dwuma", "Àwọn òfin lílo"],
        ["Customer enquiries", "Demandes des clients", "Afoforo a wɔtɔ ade nsɛmmisa", "Ìbéèrè àwọn oníbàárà"],
        ["Visit the showroom", "Visiter la salle d’exposition", "Kɔ hwɛ nneɛma no", "Ṣèbẹ̀wò sí ibi ìfihàn"],
        ["WE ARE HERE TO HELP", "NOUS SOMMES LÀ POUR AIDER", "YƐWƆ HA SƐ YƐREBƆ WO MƆ", "A WÀ NÍBÍ LÁTI RÀNLỌ́WỌ́"],
        ["Build with us", "Construisez avec nous", "Ka yɛn ho bɔ mu", "Darapọ̀ mọ́ wa"],
        ["Customer support", "Service client", "Afoforo a wɔtɔ ade mmoa", "Ìrànlọ́wọ́ oníbàárà"],
        ["Your information", "Vos informations", "Wo ho nsɛm", "Àlàyé rẹ"],
        ["Privacy policy", "Politique de confidentialité", "Koko asɛm ho banbɔ", "Ìlànà àṣírí"],
        ["Store information", "Informations sur la boutique", "Sotɔɔ ho nsɛm", "Àlàyé ilé ìtajà"],
        ["Products and orders", "Produits et commandes", "Nneɛma ne nneɛma a wɔtɔ", "Ọjà àti àwọn àṣẹ"],
        ["Questions", "Questions", "Nsɛmmisa", "Àwọn ìbéèrè"],
        ["Email the store", "Envoyer un e-mail à la boutique", "Fa email kɔma sotɔɔ no", "Fi í-meèlì ránṣẹ́ sí ilé ìtajà"],
        ["WE ARE HERE TO HELP", "NOUS SOMMES LÀ POUR AIDER", "YƐWƆ HA SƐ YƐREBƆ WO MƆ", "A WÀ NÍBÍ LÁTI RÀNLỌ́WỌ́"],
        ["Enter your email", "Saisissez votre e-mail", "Kyerɛw wo email", "Tẹ í-meèlì rẹ síbí"],
        ["Send", "Envoyer", "Soma", "Fi ránṣẹ́"],
        ["Close", "Fermer", "To mu", "Pa dé"],
        ["Cancel", "Annuler", "Twa mu", "Fagilé"],
        ["Save", "Enregistrer", "Sie", "Fi pam"],
        ["Add product", "Ajouter un produit", "Fa ade ka ho", "Fi ọjà kún un"],
        ["Save product", "Enregistrer le produit", "Sie ade no", "Fi ọjà pam"],
        ["Category", "Catégorie", "Nkyekyɛmu", "Ẹ̀ka"],
        ["Price", "Prix", "Boɔ", "Iye owó"],
        ["Description", "Description", "Nkyerɛmu", "Àpèjúwe"],
        ["Colors", "Couleurs", "Ahosuo", "Àwọ̀"],
        ["Sizes and stock", "Tailles et stock", "Kɛseɛ ne dodow a aka", "Ìwọ̀n àti ọjà tó wà"],
        ["Visible in store", "Visible en boutique", "Ɛda sotɔɔ no mu", "Ó hàn ní ilé ìtajà"],
        ["Mark as featured", "Mettre en vedette", "Hyɛ no nsow", "Ṣàmì sí i gẹ́gẹ́ bí pàtàkì"],
        ["FEATURED", "À LA UNE", "WƆAPAW", "PÀTÀKÌ"],
        ["NEW", "NOUVEAU", "FOFORO", "TUNTUN"],
        ["BEST SELLER", "MEILLEURE VENTE", "ADE A WƆTƆ PAA", "ỌJÀ TÍ Ó TA JÙ"],
        ["Your order is saved, but the invoice email could not be sent. You can track it here; contact the store if you need the invoice resent.", "Votre commande est enregistrée, mais l’e-mail de facture n’a pas pu être envoyé. Vous pouvez la suivre ici ; contactez la boutique pour demander un nouvel envoi.", "Wɔasie wo nneɛma a woatɔ no, nanso email no ankɔ. Wubetumi ahwehwɛ no ha; frɛ sotɔɔ no sɛ wopɛ sɛ wɔsan soma email no.", "A ti fi àṣẹ rẹ pam, ṣùgbọ́n a kò lè fi í-meèlì risiti ránṣẹ́. O lè tọpinpin rẹ níbí; kàn sí ilé ìtajà fún ìfiranṣẹ́ mìíràn."],
        ["Back to sign in", "Retour à la connexion", "San kɔ hyɛ mu", "Padà sí wíwọlé"],
        ["Create your account", "Créer votre compte", "Yɛ wo akawnt", "Ṣẹ̀dá àkọọ́lẹ̀ rẹ"],
        ["Reset your password", "Réinitialiser votre mot de passe", "Sesa wo pɛsɔwɔde", "Tún ọ̀rọ̀ aṣínà rẹ ṣe"],
        ["Update password", "Mettre à jour le mot de passe", "Yɛ pɛsɔwɔde no foforo", "Tún ọ̀rọ̀ aṣínà ṣe"],
        ["Continue", "Continuer", "Kɔ so", "Tẹ̀síwájú"],
        ["Pickup", "Retrait", "Fa w'ade", "Gbà á fúnra rẹ"],
        ["Delivery address", "Adresse de livraison", "Adrɛs a wɔde bɛbrɛ wo", "Àdírẹ́sì ìfijiṣẹ́"],
        ["Use my current location", "Utiliser ma position actuelle", "Fa beae a mewɔ seesei di dwuma", "Lo ibi tí mo wà báyìí"],
        ["Order note", "Note de commande", "Nneɛma a wopɛ sɛ wokae", "Àkọsílẹ̀ àṣẹ"],
        ["Language", "Langue", "Kasa", "Èdè"],
        ["Search shoes, loafers, sandals...", "Rechercher des chaussures, mocassins, sandales...", "Hwehwɛ mpaboa...", "Wá bàtà kiri..."],
        ["Popular searches", "Recherches populaires", "Nsɛmmisa a wɔhwehwɛ paa", "Àwọn ohun tí a sábà ń wá"],
        ["No shoes found", "Aucune chaussure trouvée", "Yɛannya mpaboa biara", "A kò rí bàtà kankan"],
        ["Try another shoe or category", "Essayez une autre chaussure ou catégorie", "Bɔ mpaboa anaa nkyekyɛmu foforo hwɛ", "Gbìyànjú bàtà tàbí ẹ̀ka mìíràn"],
        ["No shoes in this collection", "Aucune chaussure dans cette collection", "Mpaboa biara nni saa nneɛma yi mu", "Kò sí bàtà nínú àkójọpọ̀ yìí"],
        ["Loading...", "Chargement...", "Wɔretwe...", "Ń gbé wọlé..."],
        ["Loading order", "Chargement de la commande", "Wɔretwe nneɛma a wɔatɔ no", "Ń gbé àṣẹ wọlé"],
        ["Refresh", "Actualiser", "Yɛ foforo", "Tún un ṣe"],
        ["Refreshing store activity...", "Actualisation de l’activité de la boutique...", "Wɔreyɛ sotɔɔ dwumadi foforo...", "Ń tún ìṣe ilé ìtajà ṣe..."],
        ["Could not send your message.", "Impossible d’envoyer votre message.", "Yɛantumi ansoma wo nkrasɛm no.", "A kò lè fi ìránṣẹ́ rẹ ránṣẹ́."],
        ["Could not load order messages.", "Impossible de charger les messages de commande.", "Yɛantumi anyɛ nneɛma a wɔatɔ ho nkrasɛm no", "A kò lè ṣí àwọn ìránṣẹ́ àṣẹ."],
        ["This order has been cancelled. Contact the store if you need help.", "Cette commande a été annulée. Contactez la boutique si vous avez besoin d’aide.", "Wɔagyae nneɛma a woatɔ yi. Sɛ wohia mmoa a, frɛ sotɔɔ no.", "A fagilé àṣẹ yìí. Kàn sí ilé ìtajà bí o bá nílò ìrànlọ́wọ́."],
        ["Secure tracking access saved on this device.", "Accès sécurisé au suivi enregistré sur cet appareil.", "Wɔde ahobammɔ kwan a wɔde hwehwɛ nneɛma no asie wɔ mfiri yi so.", "A ti fi ààyè ìtọpinpin pam sórí ẹ̀rọ yìí."],
        ["This order tracking link is invalid. Use the latest link from your invoice email.", "Ce lien de suivi est invalide. Utilisez le lien le plus récent de votre e-mail de facture.", "Link a wɔde hwehwɛ nneɛma yi nyɛ nokware. Fa link foforo a ɛwɔ email no mu di dwuma.", "Ọ̀nà asopọ̀ ìtọpinpin àṣẹ yìí kò tọ́. Lo èyí tuntun jù nínú í-meèlì risiti rẹ."],
        ["Place an order to start tracking its progress.", "Passez une commande pour suivre son avancement.", "Tɔ ade na wuhwɛ sɛnea ɛrekɔ so.", "Ṣe àṣẹ kan láti bẹ̀rẹ̀ sí tọpinpin ìlọsíwájú rẹ."],
        ["Order status is unavailable.", "Le statut de la commande est indisponible.", "Nneɛma a woatɔ no tebea nni hɔ.", "Ipò àṣẹ kò sí."],
        ["Not available", "Indisponible", "Enni hɔ", "Kò sí"],
        ["Date unavailable", "Date indisponible", "Da no nni hɔ", "Ọjọ́ kò sí"],
        ["Date unavailable", "Date indisponible", "Da no nni hɔ", "Ọjọ́ kò sí"],
        ["Account Security", "Sécurité du compte", "Akawnt ahobammɔ", "Ààbò àkọọ́lẹ̀"],
        ["Verifying your email", "Vérification de votre e-mail", "Wɔreyɛ wo email no mu nhwehwɛmu", "Ń ṣàyẹ̀wò í-meèlì rẹ"],
        ["Email verified", "E-mail vérifié", "Wɔagye email no atom", "A ti fìdí í-meèlì múlẹ̀"],
        ["Could not verify email", "Impossible de vérifier l’e-mail", "Yɛantumi anhwɛ email no mu", "A kò lè fìdí í-meèlì múlẹ̀"],
        ["Continue to sign in", "Continuer vers la connexion", "Kɔ so kɔ hyɛ mu", "Tẹ̀síwájú sí wíwọlé"],
        ["Select a category", "Choisir une catégorie", "Paw nkyekyɛmu", "Yan ẹ̀ka kan"],
        ["All products", "Tous les produits", "Nneɛma no nyinaa", "Gbogbo ọjà"],
        ["Active", "Actif", "Ɛyɛ adwuma", "Ó ń ṣiṣẹ́"],
        ["Inactive", "Inactif", "Ɛnyɛ adwuma", "Kò ṣiṣẹ́"],
        ["Add campaign", "Ajouter une campagne", "Fa dawurubɔ ka ho", "Fi ìpolówó kún un"],
        ["Save campaign", "Enregistrer la campagne", "Sie dawurubɔ no", "Fi ìpolówó pam"],
        ["Backend connected", "Backend connecté", "Backend no abɔ mu", "Backend ti so pọ̀"],
        ["Backend offline", "Backend hors ligne", "Backend no nni intanɛt so", "Backend kò sí lórí ayélujára"]
    ];

    const dictionary = Object.fromEntries(rows.map(([en, fr, tw, yo]) => [en, { en, fr, tw, yo }]));
    const reverse = new Map();
    for (const [english, translations] of Object.entries(dictionary)) {
        for (const language of languages) {
            if (language !== "en" && !reverse.has(translations[language])) reverse.set(translations[language], english);
        }
    }

    const normalize = value => String(value ?? "").replace(/\s+/g, " ").trim();
    const textOriginals = new WeakMap();
    const attributeOriginals = new WeakMap();
    let activeLanguage = languages.includes(localStorage.getItem(LANGUAGE_KEY))
        ? localStorage.getItem(LANGUAGE_KEY)
        : "en";

    function englishSource(value) {
        const normalized = normalize(value);
        if (dictionary[normalized]) return normalized;
        if (reverse.has(normalized)) return reverse.get(normalized);
        const greeting = normalized.match(/^Welcome back, (.+)$/);
        if (greeting) return `Welcome back, ${greeting[1]}`;
        return normalized;
    }

    function translate(value, language = activeLanguage) {
        const source = englishSource(value);
        if (language === "en") return source;
        if (dictionary[source]) return dictionary[source][language] || source;

        let match = source.match(/^(\d+) items?$/i);
        if (match) {
            const count = Number(match[1]);
            if (language === "fr") return `${count} article${count === 1 ? "" : "s"}`;
            if (language === "tw") return `Nneɛma ${count}`;
            if (language === "yo") return `Ohun ${count}`;
        }
        match = source.match(/^Welcome back, (.+)$/);
        if (match) {
            const greeting = { fr: "Bon retour,", tw: "Yɛma wo akwaaba bio,", yo: "Ẹ káàbọ̀ padà," }[language];
            return `${greeting} ${match[1]}`;
        }
        return source;
    }

    function translateTextNode(node) {
        if (!node.nodeValue || !node.parentElement || node.parentElement.closest("script, style, noscript, code, pre, textarea, .store-language-switcher, [data-no-translate]")) return;
        const current = node.nodeValue;
        const source = textOriginals.get(node) ?? englishSource(current);
        textOriginals.set(node, source);
        const leading = current.match(/^\s*/)?.[0] || "";
        const trailing = current.match(/\s*$/)?.[0] || "";
        const replacement = `${leading}${translate(source)}${trailing}`;
        if (current !== replacement) node.nodeValue = replacement;
    }

    function translateAttribute(element, attribute) {
        if (element.closest?.(".store-language-switcher, [data-no-translate]")) return;
        const value = element.getAttribute(attribute);
        if (value === null) return;
        let originals = attributeOriginals.get(element);
        if (!originals) {
            originals = new Map();
            attributeOriginals.set(element, originals);
        }
        const source = originals.get(attribute) ?? englishSource(value);
        originals.set(attribute, source);
        const replacement = translate(source);
        if (value !== replacement) element.setAttribute(attribute, replacement);
    }

    function translateTree(root) {
        if (root.nodeType === Node.TEXT_NODE) {
            translateTextNode(root);
            return;
        }
        if (root.nodeType !== Node.ELEMENT_NODE && root !== document) return;
        if (root.nodeType === Node.ELEMENT_NODE && root.matches("script, style, noscript, code, pre, .store-language-switcher, [data-no-translate]")) return;
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        while (walker.nextNode()) translateTextNode(walker.currentNode);
        if (root.nodeType === Node.ELEMENT_NODE) {
            ["placeholder", "title", "aria-label", "alt"].forEach(attribute => translateAttribute(root, attribute));
            root.querySelectorAll("*").forEach(element => {
                ["placeholder", "title", "aria-label", "alt"].forEach(attribute => translateAttribute(element, attribute));
            });
        }
    }

    function addControl() {
        if (document.querySelector(".store-language-switcher")) return;
        const holder = document.createElement("div");
        holder.className = "store-language-switcher";
        holder.innerHTML = '<i class="fa-solid fa-globe" aria-hidden="true"></i><select aria-label="Select language" title="Select language"><option value="en">English</option><option value="fr">Français</option><option value="tw">Twi</option><option value="yo">Yorùbá</option></select>';
        const navList = document.querySelector("#navul");
        if (navList) {
            const item = document.createElement("li");
            item.className = "nav-item language-nav-item";
            item.append(holder);
            navList.append(item);
        } else {
            const host = document.querySelector(".info-topbar, .orders-topbar, .account-topbar, #nav-style, #nav2, .navbar, header");
            if (host) host.append(holder);
            else {
                holder.classList.add("language-switcher-floating");
                document.body.append(holder);
            }
        }

        const select = holder.querySelector("select");
        select.value = activeLanguage;
        select.addEventListener("change", () => setLanguage(select.value));
    }

    function setLanguage(language) {
        if (!languages.includes(language)) return;
        activeLanguage = language;
        localStorage.setItem(LANGUAGE_KEY, language);
        document.documentElement.lang = language;
        const select = document.querySelector(".store-language-switcher select");
        if (select) select.value = language;
        translateTree(document.body);
        if (document.title) {
            const titleSource = englishSource(document.title);
            document.title = translate(titleSource);
        }
        window.dispatchEvent(new CustomEvent("storelanguagechange", { detail: { language } }));
    }

    const style = document.createElement("style");
    style.textContent = `
        .store-language-switcher { display: inline-flex; align-items: center; gap: 7px; flex: 0 0 auto; padding: 5px 8px; border: 1px solid rgba(34, 66, 46, .2); border-radius: 7px; background: #fff; color: #244832; }
        .store-language-switcher i { font-size: 13px; }
        .store-language-switcher select { max-width: 98px; border: 0; outline: 0; background: transparent; color: inherit; font: 600 12px/1.2 inherit; cursor: pointer; }
        .language-nav-item { display: flex; align-items: center; }
        .info-topbar .store-language-switcher, .orders-topbar .store-language-switcher, .account-topbar .store-language-switcher, #nav-style > .store-language-switcher, #nav2 > .store-language-switcher, .navbar > .store-language-switcher, header > .store-language-switcher { margin-left: auto; }
        .language-switcher-floating { position: fixed; top: 10px; right: 10px; z-index: 12000; box-shadow: 0 3px 12px rgba(0,0,0,.12); }
        @media (max-width: 600px) { .store-language-switcher { gap: 5px; padding: 5px 6px; } .store-language-switcher select { max-width: 86px; font-size: 11px; } }
    `;
    document.head.append(style);

    window.storeLanguage = {
        get current() { return activeLanguage; },
        translate,
        set: setLanguage,
        productField(product, field) {
            const translated = product?.translations?.[activeLanguage]?.[field];
            return String(translated || product?.[field] || "");
        }
    };

    addControl();
    translateTree(document.body);
    if (document.title) document.title = translate(englishSource(document.title));
    document.documentElement.lang = activeLanguage;

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => translateTree(node));
            if (mutation.type === "characterData") translateTextNode(mutation.target);
            if (mutation.type === "attributes") translateAttribute(mutation.target, mutation.attributeName);
        });
    });
    observer.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ["placeholder", "title", "aria-label", "alt"] });

    window.addEventListener("storelanguagechange", () => {
        window.dispatchEvent(new Event("storelanguagechanged"));
    });
})();
