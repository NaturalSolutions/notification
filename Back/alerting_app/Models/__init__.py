from zope.sqlalchemy import ZopeTransactionExtension
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import scoped_session, sessionmaker

### Create a database session : one for the whole application
DBSession = scoped_session(sessionmaker())
Base = declarative_base()
dbConfig = {
    'dialect': 'mssql',
}

def cache_callback(request,session):
            if isinstance(request.exception,TimeoutError):
                session.get_bind().dispose()


def db(request):
    makerDefault = request.registry.dbmaker
    session = makerDefault()
    
    if 'ecoReleve-Core/export/' in request.url:
        makerExport = request.registry.dbmakerExport
        session = makerExport()

    def cleanup(request):
        if request.exception is not None:
            session.rollback()
            cache_callback(request,session)
        else:
            session.commit()
        session.close()
        makerDefault.remove()

    request.add_finished_callback(cleanup)
    return session


# from .User import User
# from .Adress import Adress
