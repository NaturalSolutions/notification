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

	query = text('SELECT isnull(Ap.AppName,\'No Application\') Application, isnull(Ap.ID,-1) fk_Application,Ap.AppIcone Icone, COUNT(O.ID) as NB_ERREUR FROM Alerte A LEFT JOIN ListApplication Ap ON A.Fk_Application = Ap.ID LEFT JOIN  Ocurrence_Alerte O ON O.Fk_Alerte=A.ID GROUP BY Ap.AppName,Ap.AppIcone,Ap.ID')

	results = request.dbsession.execute(query).fetchall()
	print(type(results))

	data = [dict(row) for row in results]
	return data