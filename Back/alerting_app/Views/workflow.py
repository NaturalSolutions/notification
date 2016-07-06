from pyramid.security import NO_PERMISSION_REQUIRED
from pyramid.view import view_config
from ..Models import DBSession,Base
from pyramid.response import Response
from sqlalchemy import select,text,bindparam,and_,func,Float,exists
from sqlalchemy.sql.functions import GenericFunction
import datetime
import json

@view_config(route_name='transition/id/idOcc',renderer='json',permission=NO_PERMISSION_REQUIRED )
def getWorkFlowDelete(request):

	print(request.params.mixed())
	id_ = request.matchdict['id']
	idOcc_ = request.matchdict['idOcc']

	query2 = 'SELECT  *\
			from Transition\
			WHERE ID=' + id_
	print(query2)

	results = request.dbsession.execute(query2).fetchone()

	params = request.params.mixed()
	histoTable = Base.metadata.tables['Alerte_Etat_Historique']

	val_OA = idOcc_
	val_Date = datetime.datetime.now()
	val_Etat = results['Fk_Etat_Arrive']
	val_T = id_
	val_user = 'Abel'

	print('VOILA LES VALUES DELETE')
	print(val_OA)
	print(val_Date)
	print(val_Etat)
	print(val_T)
	print(val_user)

	# query = text('SELECT * FROM Alerte_Etat_Historique WHERE Fk_Ocurrence_Alerte = :FK_OA').bindparams(bindparam('FK_OA',val_OA))

	query = text('INSERT INTO Alerte_Etat_Historique VALUES (:FK_OA, :Dat, :Fk_E, :Fk_T, :user)').bindparams(bindparam('FK_OA',val_OA), bindparam('Dat',val_Date), bindparam('Fk_E',val_Etat), bindparam('Fk_T',val_T), bindparam('user',val_user))

	insertdelete = request.dbsession.execute(query)

	return 'ok'
