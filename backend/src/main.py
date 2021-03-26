import asyncio
from peerjs.peer import Peer, PeerOptions
from peerjs.peerroom import PeerRoom
from peerjs.util import util, default_ice_servers
from peerjs.enums import ConnectionEventType, PeerEventType

options = PeerOptions(
    host="localhost",
    port=9000,
    path="/myApp",
    token=""
)

async def main():
  peer = Peer(peer_options=options)
  print('starting...')
  await peer.start()
  print('started')
  _setPnPServiceConnectionHandlers(peer)


def _setPnPServiceConnectionHandlers(peer):
  @peer.on(PeerEventType.Connection)
  async def peer_connection(peerConnection):
      print('Remote peer trying to establish connection')
      _setPeerConnectionHandlers(peerConnection)
  
def _setPeerConnectionHandlers(peerConnection):
  @peerConnection.on(ConnectionEventType.Data)
  async def pc_data(data):
      print('data received from remote peer \n%r', data)

asyncio.run(main())
