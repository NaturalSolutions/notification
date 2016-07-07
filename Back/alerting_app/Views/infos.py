
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
		print('Avec Param')
		if 'Fk_Application' in request.params.keys() :
			Fk_Application = "\'"+request.params['Fk_Application']+"\'"
			queryTotal = text('SELECT COUNT(*) as NB_ERREUR FROM Ocurrence_Alerte O JOIN Alerte A ON o.fk_alerte = A.ID WHERE A.Fk_Application ='+Fk_Application+';')
			# #recupere le nombre de row
			resultsTotal = request.dbsession.execute(queryTotal).fetchone()
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

		valkey = request.params['Fk_Application']
		query = text('DECLARE @PageNumber AS INT, @RowspPage AS INT SET @PageNumber = '+positionPage+' SET @RowspPage = '+nbPerPage
		+' select a.Nom Alerte,O.DateOccurence date,O.TextMessage,Et.Nom Etat,A.Icone,A.ObjetConcerne ,AP.AppName,O.id Ocurrence_ID,Et.ID id_Etat,A.Fk_TypeAlerte ID_TypeAlerte\
		from Ocurrence_Alerte O\
		JOIN Alerte_Etat E ON O.id = e.Fk_Ocurrence_Alerte \
		join etat Et on E.fk_etat = Et.id\
		JOIN Alerte A ON o.Fk_Alerte = A.ID LEFT JOIN ListApplication AP ON Ap.ID = a.fk_Application WHERE  A.fk_application=:val ORDER BY O.ID OFFSET ((@PageNumber - 1) * @RowspPage) ROWS FETCH NEXT @RowspPage ROWS ONLY').bindparams(bindparam('val',valkey))
	else:
		print("Aucun param on renvoi l'ensemble des ressources")
		nbPerPage = resultsTotal['NB_ALERTE']
		query = 'select A.*,e.nom Etat from Ocurrence_Alerte A JOIN Alerte_Etat E ON a.id = e.Fk_Ocurrence_Alerte join etat E on A.fk_etat = E.id'

	params = request.params.mixed()
	logTable = Base.metadata.tables['Ocurrence_Alerte']

	results = request.dbsession.execute(query).fetchall()
	data = [dict(row) for row in results]

	for ligne in data:
		print('*******************LIGNE ********************')
		print(ligne)
		query = 'select lt.ID,lt.nom,lt.IconeEtat from liste_transitions lt where lt.fk_etat=' + str(ligne['id_Etat']) + ' and Fk_TypeAlerte=' + str(ligne['ID_TypeAlerte'])
		print(query)
		results = request.dbsession.execute(query).fetchall()
		Transitions = [dict(row) for row in results]
		ligne['Transitions_possibles'] = Transitions
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

	#query2 = select([typeTable.c['NomType'], typeTable.c['Icone'], logTable.c['ID'],logTable.c['Date'],alerteTable.c['Nom'],alerteTable.c['Comportement'],alerteTable.c['Niveau'],alerteTable.c['Application'],alerteTable.c['Requete'],alerteTable.c['RequeteCorrection']]).where(and_(logTable.c['Fk_Alerte'] == alerteTable.c['ID'], alerteTable.c['Fk_TypeAlerte'] == typeTable.c['ID'], logTable.c['ID'] == id_))
	query2 = 'SELECT O.ID,o.DateOccurence,A.Icone,A.Niveau, O.TextMessage,ET.Nom EtatNom,et.Icone IconeEtat,ET.ClasseCSS ClasseCssEtat,A.Nom,A.ObjetConcerne,A.Requete,a.URL,A.Texte,ap.AppName,ap.AppIcone\
			from Ocurrence_Alerte O\
			JOIN Alerte_Etat E ON O.id = e.Fk_Ocurrence_Alerte\
			join etat Et on E.fk_etat = Et.id\
			JOIN Alerte A ON o.Fk_Alerte = A.ID LEFT JOIN ListApplication AP ON Ap.ID = a.fk_Application \
			WHERE o.ID=' + id_


	results = request.dbsession.execute(query2).fetchone()
	data = dict(results)


		#print(ligne)

	queryTransitions = text('Select Nom,ID,IconeEtat From liste_transitions Where Fk_Etat = (SELECT E.ID as current_Etat FROM Ocurrence_Alerte O JOIN Alerte_Etat_Historique AE ON O.id = ae.Fk_Ocurrence_Alerte join etat E on AE.fk_etat = E.id INNER JOIN (SELECT Fk_Ocurrence_Alerte, MAX(dateEtat) AS DateMax FROM Alerte_Etat_Historique GROUP BY Fk_Ocurrence_Alerte ) Maxquery ON AE.Fk_Ocurrence_Alerte = Maxquery.Fk_Ocurrence_Alerte WHERE  ae.Fk_Ocurrence_Alerte=:Current and Maxquery.DateMax = AE.DateEtat)').bindparams(bindparam('Current',id_))
	resTransitions = request.dbsession.execute(queryTransitions).fetchall()


	Transitions_possibles=[dict(row) for row in resTransitions]
	data['Transitions_possibles'] = Transitions_possibles
	queryID = text('Select replace(A.url,\'@id\',ValeurID) url from Ocurrence_Alerte_IDs  I JOIN Ocurrence_Alerte O on i.Fk_Ocurrence_Alerte = o.id JOIN Alerte A ON O.Fk_Alerte = A.ID Where I.Fk_Ocurrence_Alerte =' + id_)
	resID = request.dbsession.execute(queryID).fetchall()

	Transitions_possibles=[dict(row) for row in resID]
	data['URLs'] = [row['url'] for row in resID]


	
	#time.sleep(4)
	return data

