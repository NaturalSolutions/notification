
from pyramid.security import NO_PERMISSION_REQUIRED
from pyramid.view import view_config
from ..Models import DBSession,Base
from pyramid.response import Response
from sqlalchemy import select,text,bindparam,and_
import json
import time

@view_config(route_name='infos',renderer='json',permission=NO_PERMISSION_REQUIRED )
def getSomeLogs(request):

	positionPage = "1"

	if len( request.params ) > 0:
		if 'Fk_Alerte' in request.params.keys() :
			Fk_Alerte = "\'"+request.params['Fk_Alerte']+"\'"
			queryTotal = text('SELECT COUNT(*) as NB_ERREUR FROM Ocurrence_Alerte WHERE Fk_Alerte ='+Fk_Alerte+';')
			# #recupere le nombre de row
			resultsTotal = DBSession.execute(queryTotal).fetchone()
		else:
			print("non pas d'Alerte en parametre")
		if 'page' in request.params.keys():
			positionPage = request.params['page']
		if 'per_page' in request.params.keys():
			nbPerPage = request.params['per_page']
		if 'search' in request.params.keys():
			search = request.params['search']
		else:
			search =''

		#nbPerPage = 10

		valkey = request.params['Fk_Alerte']
		query = text('DECLARE @PageNumber AS INT, @RowspPage AS INT SET @PageNumber = '+positionPage+' SET @RowspPage = '+nbPerPage+' SELECT O.ID as Ocurrence_ID, O.Fk_Alerte as Alerte_ID, A.Nom,ae.DateEtat as Derniere_Modification,e.nom etat FROM Ocurrence_Alerte O JOIN  Alerte A ON O.Fk_Alerte=A.ID JOIN Alerte_Etat_Historique AE ON O.id = ae.Fk_Ocurrence_Alerte join etat E on AE.fk_etat = E.id INNER JOIN (SELECT Fk_Ocurrence_Alerte, MAX(dateEtat) AS DateMax FROM Alerte_Etat_Historique GROUP BY Fk_Ocurrence_Alerte ) Maxquery ON AE.Fk_Ocurrence_Alerte = Maxquery.Fk_Ocurrence_Alerte WHERE  O.Fk_Alerte=:val and Maxquery.DateMax = AE.DateEtat ORDER BY O.ID OFFSET ((@PageNumber - 1) * @RowspPage) ROWS FETCH NEXT @RowspPage ROWS ONLY').bindparams(bindparam('val',valkey))
	else:
		print("Aucun param on renvoi l'ensemble des ressources")
		nbPerPage = resultsTotal['NB_ALERTE']
		query = 'select A.*,e.nom Etat from Ocurrence_Alerte A JOIN Alerte_Etat E ON a.id = e.Fk_Ocurrence_Alerte join etat E on A.fk_etat = E.id'

	params = request.params.mixed()
	logTable = Base.metadata.tables['Ocurrence_Alerte']

	results = DBSession.execute(query).fetchall()

	data = [dict(row) for row in results]

	lMin = (int(positionPage)-1)*(int(nbPerPage))
	lMax = lMin + len(results)
	request.response.headers.update({'Access-Control-Expose-Headers' : 'true'})
	request.response.headers.update({ 'Content-Range' : ''+str(lMin)+'-'+str(lMax)+'/'+str(resultsTotal['NB_ERREUR'])+''})
	request.response.headers.update({ 'Content-Max' : ''+str(resultsTotal['NB_ERREUR'])+''})

	return data

@view_config(route_name='infos/id',renderer='json',permission=NO_PERMISSION_REQUIRED )
def getAllLogs(request):

	print(request.params.mixed())
	id_ = request.matchdict['id']
	logTable = Base.metadata.tables['Ocurrence_Alerte']
	alerteTable = Base.metadata.tables['Alerte']
	typeTable = Base.metadata.tables['TypeAlerte']
	etatTable = Base.metadata.tables['TypeAlerte']

	query2 = select([typeTable.c['NomType'], typeTable.c['Icone'], logTable.c['ID'],logTable.c['Date'],alerteTable.c['Nom'],alerteTable.c['Comportement'],alerteTable.c['Niveau'],alerteTable.c['Application'],alerteTable.c['Requete'],alerteTable.c['RequeteCorrection']]).where(and_(logTable.c['Fk_Alerte'] == alerteTable.c['ID'], alerteTable.c['Fk_TypeAlerte'] == typeTable.c['ID'], logTable.c['ID'] == id_))

	print(query2)

	results = DBSession.execute(query2).fetchone()
	data = dict(results)
	queryTransitions = text('Select Nom From liste_transitions Where Fk_Etat = (SELECT E.ID as current_Etat FROM Ocurrence_Alerte O JOIN Alerte_Etat_Historique AE ON O.id = ae.Fk_Ocurrence_Alerte join etat E on AE.fk_etat = E.id INNER JOIN (SELECT Fk_Ocurrence_Alerte, MAX(dateEtat) AS DateMax FROM Alerte_Etat_Historique GROUP BY Fk_Ocurrence_Alerte ) Maxquery ON AE.Fk_Ocurrence_Alerte = Maxquery.Fk_Ocurrence_Alerte WHERE  ae.Fk_Ocurrence_Alerte=:Current and Maxquery.DateMax = AE.DateEtat)').bindparams(bindparam('Current',id_))
	resTransitions = DBSession.execute(queryTransitions).fetchall()
	print('RESULTAT DE LA QUERY')
	print(resTransitions)
	Transitions_possibles=[dict(row) for row in resTransitions]
	data['Transitions_possibles'] = Transitions_possibles
	print(type(Transitions_possibles))
	#time.sleep(4)
	return data

