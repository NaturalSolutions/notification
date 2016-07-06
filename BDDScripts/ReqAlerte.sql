select a.Nom Alerte,O.DateOccurence date,O.TextMessage,Et.Nom Etat,A.Icone,A.ObjetConcerne,AP.AppName
from Ocurrence_Alerte O
JOIN Alerte_Etat E ON O.id = e.Fk_Ocurrence_Alerte 
join etat Et on E.fk_etat = Et.id
JOIN Alerte A ON o.Fk_Alerte = A.ID
LEFT JOIN ListApplication AP ON Ap.ID = a.fk_Application
where A.fk_application =9