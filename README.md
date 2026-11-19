# Menus à deux

Petite appli web qui prépare les menus de quatre semaines pour deux personnes. On mange les mêmes plats, mais chacun a ses propres portions calculées selon ses besoins.

## Ce qu'elle fait

Les besoins de chacun sont calculés avec la formule de Mifflin St Jeor à partir du sexe, de l'âge, de la taille, du poids, du niveau d'activité et de l'objectif. Les jours sans salle, les glucides baissent un peu.

Chaque jour propose un petit déjeuner, un midi et un dîner. Les portions sont données en grammes crus pour chaque personne, et chaque plat a sa recette avec les temps de préparation et de cuisson. Les plats de 20 minutes ou moins sont marqués Rapide.

Comme la viande perd environ un quart de son poids à la cuisson et que les féculents en prennent, l'appli donne aussi le poids une fois cuit. Quand on cuisine pour deux, la fiche Les deux indique comment partager ce qui sort de la poêle, assiette par assiette et boîte par boîte.

Les quantités de toute la journée sont calculées ensemble pour viser les protéines, les glucides, les lipides et les calories, avec pour chaque aliment une fourchette réaliste selon le repas. Si un plat ne suffit pas, du pain complet vient en accompagnement. Les jours où l'objectif ne peut pas être atteint, l'appli le dit et propose quoi ajouter.

Le midi et le soir gardent chacun leur part de protéines, de lipides et de glucides. Sans ça, un midi riche en matières grasses donnait une montagne de riz le soir.

Si les portions paraissent trop copieuses ou trop légères, le réglage Quantités du profil enlève ou ajoute des calories chaque jour, sans toucher aux protéines. Anthony est à 300 kcal de moins par jour.

Un plat qui ne plaît pas se change d'un appui, ou se retire pour de bon avec Je n'aime pas. Les plats retirés se remettent depuis Réglages.

Le petit déjeuner peut être fixe pour une personne. Princesse a toujours flocons d'avoine, muesli chocolat au lait Chabrior et lait.

L'option Restes du dîner le midi prévoit le dîner en double pour le lendemain midi en semaine. Le soir, l'appli donne les quantités totales à cuisiner, boîtes comprises.

Le calendrier d'alternance est pris en compte : les jours en entreprise, pas de repas du midi pour la personne concernée.

À la fin des quatre semaines, l'appli propose de préparer les suivantes. Le stock et les courses validées sont gardés.

## Courses et stock

L'onglet Courses donne la liste de la semaine pour les deux, rangée par rayon, avec une estimation du prix. Après les courses, on appuie sur J'ai fait les courses et on corrige les quantités vraiment achetées. Le surplus part dans le stock et n'apparaît plus dans les listes suivantes tant qu'il en reste.

## Suivi du poids

Chacun peut noter son poids. L'appli trace la moyenne sur 7 jours, la tendance par semaine et l'écart avec le poids visé. Si la tendance sort de la cible de l'objectif pendant deux semaines, elle ajuste les calories toute seule, de 250 kcal au plus à chaque fois.

## Partage à deux

Les menus, les profils, le stock et la liste de courses sont partagés entre les deux téléphones grâce à Firestore. Dans Réglages, on crée un foyer sur un téléphone puis on saisit le code affiché sur l'autre. Tout se synchronise ensuite en direct, et l'appli continue de marcher sans réseau. Chaque téléphone s'ouvre sur le profil de son propriétaire.

Les règles de sécurité Firestore sont dans le fichier firestore.rules. Elles imposent une connexion anonyme, interdisent de lister les foyers et limitent les champs acceptés. Seul quelqu'un qui connaît le code du foyer peut lire ou modifier ses données.

## Installer sur téléphone

Sur iPhone, ouvrir le lien dans Safari, appuyer sur Partager puis Sur l'écran d'accueil. Sur Android, ouvrir le lien dans Chrome puis Installer l'application dans le menu. L'appli se met à jour toute seule, et sa version est affichée en bas de Réglages.

## Tests

Le dossier tests contient trois vérifications à lancer avec Node et jsdom.

audit-portions.js vérifie chaque repas sur des milliers de journées avec des règles de bon sens. Avec l'option foyer, il teste nos deux profils.

fuzz.js tire au hasard des profils, des réglages et des actions, et vérifie les calculs et l'affichage.

features.js vérifie les migrations, les semaines, le mois suivant, le poids visé, les plats renommés et tous les écrans.

## Fichiers

index.html contient toute l'appli.
manifest.webmanifest et le dossier icons servent à l'installation sur l'écran d'accueil.
sw.js permet l'utilisation hors ligne.
firestore.rules contient les règles à coller dans la console Firebase.
