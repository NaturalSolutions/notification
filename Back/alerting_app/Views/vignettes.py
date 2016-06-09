from pyramid.security import NO_PERMISSION_REQUIRED
from pyramid.view import view_config
from ..Models import DBSession,Base
from pyramid.response import Response
from sqlalchemy import select,text,bindparam
import json

@view_config(route_name='vignettes',renderer='json',permission=NO_PERMISSION_REQUIRED )
def getLogs(request):

	print(request.params.mixed())

	params = request.params.mixed()
	logTable = Base.metadata.tables['Ocurrence_Alerte']
	logTableJointure = Base.metadata.tables['Alerte']

	query = text('SELECT Fk_TypeAlerte, Icone, NomType, COUNT(O.ID) as NB_ERREUR FROM Alerte A, Ocurrence_Alerte O, TypeAlerte T WHERE O.Fk_Alerte=A.ID and A.Fk_TypeAlerte = T.ID GROUP BY Fk_TypeAlerte, NomType, Icone')

	results = DBSession.execute(query).fetchall()
	print(type(results))

	data = [dict(row) for row in results]
	return data