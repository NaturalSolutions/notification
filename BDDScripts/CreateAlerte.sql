
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[pr_LaunchAlerte]') AND type in (N'P', N'PC'))
DROP PROCEDURE pr_LaunchAlerte
GO

CREATE PROCEDURE pr_LaunchAlerte
AS
BEGIN

--- On prend les alertes actives


	DECLARE @ID INT
			,@Requete nvarchar(MAX)
			,@Comportement TINYINT

	DECLARE @Resulat Table (
			ID VARCHAR(255)
			,dateValeur DATETIME
			,TextMessage VARCHAR(MAX)
	)
 

	 DECLARE @InsertedAlertes Table (
			ID INT
			,IDResultat VARCHAR(255)
			,dateValeur DATETIME
	)

	DECLARE cur_Alerte CURSOR FOR
		select ID,Requete,Comportement from [dbo].[Alerte] A where (Comportement & 1) = 0
 
	OPEN cur_Alerte
 
	FETCH cur_Alerte INTO @ID,@Requete,@Comportement
 
	WHILE @@FETCH_STATUS = 0
	BEGIN


		

		insert into @Resulat
		exec sp_executesql @Requete

		
		-- TODO Gestion comportement  par exemple ne pas répeter les alertes existantes + ID par alerte etc.


		IF (@Comportement & 2) = 0  -- Une alerte par ligne
		BEGIN
				Print 'Une Alerte par ligne'

				INSERT INTO [Ocurrence_Alerte]
				   ([Fk_Alerte]
				   ,[TextMessage]
				   ,[DateOccurence])
				OUTPUT inserted.ID,inserted.TextMessage, inserted.DateOccurence into @InsertedAlertes
				SELECT DISTINCT @ID,R.ID,R.dateValeur
				FROM @Resulat R


			UPDATE [Ocurrence_Alerte]
			SET TextMessage = ''
			WHERE ID in (select ID FROM @InsertedAlertes)

			--select * from @InsertedAlertes

		END
		ELSE
		BEGIN
			Print 'Une Alerte Pour toutes les lignes'
			INSERT INTO [dbo].[Ocurrence_Alerte]
				   ([Fk_Alerte]
				   ,[TextMessage]
				   ,[DateOccurence])
				OUTPUT inserted.ID,NULL,inserted.DateOccurence into @InsertedAlertes
			SELECT DISTINCT @ID,r.TextMessage,dateValeur
			FROM @Resulat R
		END

		INSERT INTO [dbo].[Alerte_Etat_Historique]
			   ([Fk_Ocurrence_Alerte]
			   ,[DateEtat]
			   ,[Fk_Etat]
			   ,[Fk_Transition]
			   ,[Utilisateurs])
		SELECT I.ID,getdate(),1,1,'Job'
		FROM @InsertedAlertes I


		INSERT INTO [dbo].[Ocurrence_Alerte_IDs]
			   ([Fk_Ocurrence_Alerte]
			   ,[ValeurID]
			   ,[ValeurMessage])
		SELECT DISTINCT I.ID,r.ID,TextMessage
		FROM @Resulat R JOIN @InsertedAlertes I ON r.dateValeur = i.dateValeur and (R.ID = i.IDResultat or i.IDResultat IS NULL)

		--SELECT DISTINCT I.ID,r.ID,TextMessage
		--FROM @Resulat R JOIN @InsertedAlertes I ON r.dateValeur = i.dateValeur and (R.ID = i.IDResultat or i.IDResultat IS NULL)

	

		DELETE FROM @Resulat
		DELETE FROM @InsertedAlertes
		
		FETCH cur_Alerte INTO  @ID,@Requete,@Comportement

	END
 
	CLOSE cur_Alerte
	DEALLOCATE cur_Alerte


END