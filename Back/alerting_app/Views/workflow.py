from pyramid.security import NO_PERMISSION_REQUIRED
from pyramid.view import view_config
from ..Models import DBSession,Base
from pyramid.response import Response
from sqlalchemy import select,text,bindparam,and_,func,Float,exists
from sqlalchemy.sql.functions import GenericFunction
import datetime
import json

@view_config(route_name='delete/id',renderer='json',permission=NO_PERMISSION_REQUIRED )
def getWorkFlowDelete(request):

	print(request.params.mixed())
	id_ = request.matchdict['id']

	params = request.params.mixed()
	histoTable = Base.metadata.tables['Alerte_Etat_Historique']

	val_OA = id_
	val_Date = datetime.datetime.now()
	val_Etat = 3
	val_T = 1
	val_user = 'Abel'

	print('VOILA LES VALUES DELETE')
	print(val_OA)
	print(val_Date)
	print(val_Etat)
	print(val_T)
	print(val_user)

	# query = text('SELECT * FROM Alerte_Etat_Historique WHERE Fk_Ocurrence_Alerte = :FK_OA').bindparams(bindparam('FK_OA',val_OA))

	query = text('INSERT INTO Alerte_Etat_Historique VALUES (:FK_OA, :Dat, :Fk_E, :Fk_T, :user)').bindparams(bindparam('FK_OA',val_OA), bindparam('Dat',val_Date), bindparam('Fk_E',val_Etat), bindparam('Fk_T',val_T), bindparam('user',val_user))

	insertdelete = DBSession.execute(query)

	return 'ok'

@view_config(route_name='ignore/id',renderer='json',permission=NO_PERMISSION_REQUIRED )
def getWorkFlowIgnore(request):

	print(request.params.mixed())
	id_ = request.matchdict['id']

	params = request.params.mixed()
	histoTable = Base.metadata.tables['Alerte_Etat_Historique']

	val_OA = id_
	val_Date = datetime.datetime.now()
	val_Etat = 2
	val_T = 2
	val_user = 'Abel'

	print('VOILA LES VALUES IGNORE')
	print(val_OA)
	print(val_Date)
	print(val_Etat)
	print(val_T)
	print(val_user)

	# query = text('SELECT * FROM Alerte_Etat_Historique WHERE Fk_Ocurrence_Alerte = :FK_OA').bindparams(bindparam('FK_OA',val_OA))

	query = text('INSERT INTO Alerte_Etat_Historique VALUES (:FK_OA, :Dat, :Fk_E, :Fk_T, :user)').bindparams(bindparam('FK_OA',val_OA), bindparam('Dat',val_Date), bindparam('Fk_E',val_Etat), bindparam('Fk_T',val_T), bindparam('user',val_user))

	insertignore = DBSession.execute(query)

	return 'ok'

@view_config(route_name='treat/id',renderer='json',permission=NO_PERMISSION_REQUIRED )
def getWorkFlowTreat(request):

	print(request.params.mixed())
	id_ = request.matchdict['id']

	params = request.params.mixed()
	histoTable = Base.metadata.tables['Alerte_Etat_Historique']

	val_OA = id_
	val_Date = datetime.datetime.now()
	val_Etat = 1
	val_T = 3
	val_user = 'Abel'

	print('VOILA LES VALUES TREAT')
	print(val_OA)
	print(val_Date)
	print(val_Etat)
	print(val_T)
	print(val_user)

	# query = text('SELECT * FROM Alerte_Etat_Historique WHERE Fk_Ocurrence_Alerte = :FK_OA').bindparams(bindparam('FK_OA',val_OA))

	query = text('INSERT INTO Alerte_Etat_Historique VALUES (:FK_OA, :Dat, :Fk_E, :Fk_T, :user)').bindparams(bindparam('FK_OA',val_OA), bindparam('Dat',val_Date), bindparam('Fk_E',val_Etat), bindparam('Fk_T',val_T), bindparam('user',val_user))

	inserttreat = DBSession.execute(query)

	return 'ok'

@view_config(route_name='putonhold/id',renderer='json',permission=NO_PERMISSION_REQUIRED )
def getWorkFlowPutOnHold(request):

	print(request.params.mixed())
	id_ = request.matchdict['id']

	params = request.params.mixed()
	histoTable = Base.metadata.tables['Alerte_Etat_Historique']

	val_OA = id_
	val_Date = datetime.datetime.now()
	val_Etat = 4
	val_T = 0
	val_user = 'Abel'

	print('VOILA LES VALUES POH')
	print(val_OA)
	print(val_Date)
	print(val_Etat)
	print(val_T)
	print(val_user)

	# query = text('SELECT * FROM Alerte_Etat_Historique WHERE Fk_Ocurrence_Alerte = :FK_OA').bindparams(bindparam('FK_OA',val_OA))

	query = text('INSERT INTO Alerte_Etat_Historique VALUES (:FK_OA, :Dat, :Fk_E, :Fk_T, :user)').bindparams(bindparam('FK_OA',val_OA), bindparam('Dat',val_Date), bindparam('Fk_E',val_Etat), bindparam('Fk_T',val_T), bindparam('user',val_user))

	insertpoh = DBSession.execute(query)

	return 'ok'

