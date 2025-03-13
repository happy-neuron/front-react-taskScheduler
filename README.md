# TaskScheduler

Le but de cet exercice est de créer un composant TaskScheduler.

Ce dernier affiche une liste de tâches à réaliser. Il contient les règles métier suivante :
- les tâches ont un titre, une description, une date d'échéance dans la langue de l'utilisateur, un temps estimé et un statut (en attente, en cours, terminé, annulé)
- les tâches en attente peuvent être démarrées, annulées, terminées via un bouton
- les tâches en cours peuvent être terminées ou annulées via un bouton
- les autres tâches sont en consultation simple et affichées avec une opacité réduite
- à chaque changement de statut d'une tâche, un callback sera appelé au niveau du parent
- la couleur de la tâche diffère selon sa priorité
- un recherche est disponible, elle s'effectue par mot clé recherché dans le titre de la tâche (insensible à la casse) et par priorité 
- au chargement du composant, le focus est donné au champ de recherche
- si aucune tâche n'est définie ou ne correspond à la recherche, un message approprié sera affiché
- depuis le parent, il est possible d'ajouter une nouvelle tâche
