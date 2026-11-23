# Menus à deux

Petite appli web qui prépare les menus de quatre semaines pour deux personnes. On mange les mêmes plats, mais chacun a ses propres portions calculées selon ses besoins.

## Ce qu'elle fait

Les besoins de chacun sont calculés avec la formule de Mifflin St Jeor à partir du sexe, de l'âge, de la taille, du poids, du niveau d'activité et de l'objectif. Les jours sans salle, les glucides baissent un peu.

Chaque jour propose un petit déjeuner, un midi et un dîner. Les portions sont données en grammes crus pour chaque personne, et chaque plat a sa recette avec les temps de préparation et de cuisson. Les plats de 20 minutes ou moins sont marqués Rapide.

Comme la viande perd du poids à la cuisson et que les féculents en prennent, l'appli donne aussi une estimation du poids une fois cuit. Quand on cuisine pour deux, la fiche Les deux sert au partage : on pèse tout ce qui sort de la poêle, on note le poids, et l'appli calcule la part de chaque assiette et de chaque boîte. Elle retient la cuisson pour les fois suivantes, sur le téléphone qui a servi.

Les quantités de toute la journée sont calculées ensemble pour viser les protéines, les glucides, les lipides et les calories, avec pour chaque aliment une fourchette réaliste selon le repas. Si un plat ne suffit pas, du pain complet vient en accompagnement. Les jours où l'objectif ne peut pas être atteint, l'appli le dit et propose quoi ajouter.

Le midi et le soir gardent chacun leur part de protéines, de lipides et de glucides. Sans ça, un midi riche en matières grasses donnait une montagne de riz le soir.

Si les portions paraissent trop copieuses ou trop légères, le réglage Quantités du profil enlève ou ajoute des calories chaque jour, sans toucher aux protéines. Anthony est à 300 kcal de moins par jour.

Le petit déjeuner peut être fixé dans le profil. Celui d'Anthony est verrouillé à ses quantités : 4 œufs brouillés, 2 tranches de blanc de poulet, 45 g de pain complet, 5 g de beurre et une pomme. Le midi et le soir s'adaptent autour. Celui de Princesse est un bol moitié flocons d'avoine, moitié muesli chocolat au lait Chabrior, avec entre 180 et 260 ml de lait pour qu'il ne soit jamais pâteux.

Un plat qui ne plaît pas se change d'un appui, ou se retire pour de bon avec Je n'aime pas. Les plats retirés se remettent depuis Réglages.

L'option Restes du dîner le midi prévoit le dîner en double pour le lendemain midi en semaine. Le soir, l'appli donne les quantités totales à cuisiner, boîtes comprises.

Le calendrier d'alternance est pris en compte : les jours en entreprise, pas de repas du midi pour la personne concernée.

Un midi ou un soir peut passer en repas libre, pour des invités ou un resto, depuis la fiche du plat. Ce repas ne compte plus ni dans les portions ni dans les courses, et le reste de la journée ne grossit pas pour compenser. Si le dîner d'un soir est libre, le plat prévu en restes le lendemain midi est simplement à cuisiner ce jour là.

À la fin des quatre semaines, l'appli propose de préparer les suivantes. Le stock et les courses validées sont gardés.

## Courses et stock

L'onglet Courses donne la liste de la semaine pour les deux, rangée par rayon, avec une estimation du prix. Après les courses, on appuie sur J'ai fait les courses et on corrige les quantités vraiment achetées. Le surplus part dans le stock et n'apparaît plus dans les listes suivantes tant qu'il en reste.

Le stock baisse tout seul : chaque matin, ce que les menus prévoyaient la veille en est retiré. Quand il ne manque qu'une fin de paquet, moins de 20 % du besoin et jamais plus de 200 g, l'appli considère qu'on fait avec et ne l'ajoute pas aux courses.

Les conserves et les briques s'achètent entières : haricots rouges, pois chiches, champignons, thon, coulis et lait de coco. Pour ne pas laisser de fond de boîte au frigo, la quantité cuisinée d'un repas, boîtes du lendemain comprises, est arrondie à la boîte entière. Pour le thon, le coulis et le lait de coco, l'arrondi ne se fait que s'il change peu les portions. Quand il reste quand même un fond, la fiche du plat dit combien et comment le garder.

Les produits qui ne servent dans aucune recette, sauces, épices, surgelés tout prêts, sont notés à part dans Le reste à la maison. Ils ne baissent pas tout seuls, on corrige à la main.

Pour ne pas laisser dormir ce qu'on a au congélateur, quelques plats existent uniquement pour l'écouler : épaule de porc, merguez, cuisses de poulet, lardons, butternut, lait de coco et nouilles de riz. Tant qu'il en reste, l'appli les place sur des dîners des semaines pas encore achetées, un tous les trois jours au plus. Le bouton Caser mon stock dans les menus refait ce placement à la demande.

## Suivi du poids

Chacun peut noter son poids. L'appli trace la moyenne sur 7 jours, la tendance par semaine et l'écart avec le poids visé. Si la tendance sort de la cible de l'objectif pendant deux semaines, elle ajuste les calories toute seule, de 250 kcal au plus à chaque fois.

## Partage à deux

Les menus, les profils, le stock et la liste de courses sont partagés entre les deux téléphones grâce à Firestore. Dans Réglages, on crée un foyer sur un téléphone puis on saisit le code affiché sur l'autre. Tout se synchronise ensuite en direct, et l'appli continue de marcher sans réseau. Chaque téléphone s'ouvre sur le profil de son propriétaire.

Les règles de sécurité Firestore sont dans le fichier firestore.rules. Elles imposent une connexion anonyme, interdisent de lister les foyers et limitent les champs acceptés. Seul quelqu'un qui connaît le code du foyer peut lire ou modifier ses données. Pour ne pas avoir à modifier ces règles, la date du stock, les repas libres et Le reste à la maison voyagent rangés dans le journal des courses.

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
