INSERT INTO [dbo].[TypeAlerte]
           ([NomType])
     VALUES
           ('Notification')



INSERT INTO [dbo].[Alerte]
           ([Fk_TypeAlerte]
           ,[Nom]
           ,[Comportement]
           ,[fk_Application]
           ,[ObjetConcerne]
           ,[Icone]
           ,[Niveau]
           ,[Requete]
           ,[URL]
           ,[RequeteCorrection]
           ,[Texte])
     select
           TA.ID
           ,'Oiseau Immobile'
           ,0
           ,Ap.ID
           ,'Individu'
           ,NULL
           ,2
           ,'SELECT *  FROM [ecoReleve_Sensor].[dbo].[T_argosgps]  where type = ''gps'' and date > GETDAte() -10   and FK_ptt in (SELECT [FK_ptt] FROM [ecoReleve_Sensor].[dbo].[Tgps_engineering] where txDate > GETDAte() -10 group by FK_ptt having VAR(activity) < 5) order by FK_ptt,date'
           ,'http://serveur2008/ecoReleve/#individuals/@id'
           ,NULL
           ,'Oiseau Immobile'
		   from [TypeAlerte] TA JOIN ListApplication AP ON Ap.APPName = 'ecoRelevé' where [NomType]='Notification' 


INSERT INTO [dbo].[Etat]
           ([Nom]
           ,[Icone]
           ,[ClasseCSS])
		   VALUES ('Raised',NULL,NULL)


INSERT INTO [dbo].[Etat]
           ([Nom]
           ,[Icone]
           ,[ClasseCSS])
		   VALUES ('Treated',NULL,NULL)


INSERT INTO [dbo].[Etat]
           ([Nom]
           ,[Icone]
           ,[ClasseCSS])
		   VALUES ('Ignored',NULL,NULL)

INSERT INTO [dbo].[Etat]
           ([Nom]
           ,[Icone]
           ,[ClasseCSS])
		   VALUES ('Deleted',NULL,NULL)


INSERT INTO [dbo].[Etat]
           ([Nom]
           ,[Icone]
           ,[ClasseCSS])
		   VALUES ('Pending',NULL,NULL)


INSERT INTO [dbo].[Transition]
           ([Nom]
           ,[Icone]
           ,[Comportement]
           ,[Fk_Etat_Arrive])
		   select 'Treat',NULL,NULL,ID
		   FROM Etat where Nom ='Treated'






