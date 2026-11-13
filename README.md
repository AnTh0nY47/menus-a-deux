# Menus du mois à deux

Petite appli web qui génère les menus d'un mois pour deux personnes. On mange les mêmes plats, mais chacun a ses propres portions calculées selon ses besoins.

## Ce qu'elle fait

Les besoins de chacun sont calculés avec la formule de Mifflin St Jeor à partir du sexe, de l'âge, de la taille, du poids, du niveau d'activité et de l'objectif. Les jours sans salle, les glucides baissent un peu.

Chaque jour propose un petit déjeuner, un midi, une collation et un dîner. Les portions sont données en grammes crus pour chaque personne.

L'onglet Courses donne la liste de la semaine pour les deux, rangée par rayon, avec une estimation du prix.

L'onglet Stock garde ce qui reste à la maison. Après les courses, on appuie sur J'ai fait les courses et on corrige les quantités vraiment achetées. Le surplus, par exemple un gros paquet de riz ou une barquette de viande en plus, part dans le stock et n'apparaît plus dans les listes suivantes tant qu'il en reste. On peut aussi ajouter à la main ce qu'on a déjà dans les placards.

Le calendrier d'alternance est pris en compte : les jours en entreprise, pas de repas du midi pour la personne concernée.

## Installer sur téléphone

Sur iPhone, ouvrir le lien dans Safari, appuyer sur Partager puis Sur l'écran d'accueil.

Sur Android, ouvrir le lien dans Chrome puis Installer l'application dans le menu.

L'appli s'ouvre alors en plein écran comme une vraie application et fonctionne aussi sans réseau.

## Données

Les profils et réglages restent enregistrés dans le navigateur du téléphone. Rien n'est envoyé sur un serveur. Il faut donc les saisir une fois sur chaque appareil.

## Fichiers

index.html contient toute l'appli.
manifest.webmanifest et le dossier icons servent à l'installation sur l'écran d'accueil.
sw.js permet l'utilisation hors ligne.
