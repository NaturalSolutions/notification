from pyramid.security import NO_PERMISSION_REQUIRED
from pyramid.view import view_config
from ..Models import DBSession,Base
from pyramid.response import Response
from sqlalchemy import select,text,bindparam
import json

@view_config(route_name='origin',renderer='json',permission=NO_PERMISSION_REQUIRED )
def getLogs(request):

	print(request.params.mixed())
	origin_ = request.matchdict['origin']
	print(origin_+" ORIGIN DATA")
	params = request.params.mixed()
	logTable = Base.metadata.tables['TLOG_MESSAGES']

	query = text('SELECT ID,SCOPE,ORIGIN,JCRE FROM TLOG_MESSAGES where ORIGIN = :ori').bindparams(bindparam('ori',origin_))

	results = DBSession.execute(query).fetchall()
	print(type(results))

	data = [dict(row) for row in results]
	return data
