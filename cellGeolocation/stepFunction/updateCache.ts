import {
	DynamoDBClient,
	PutItemCommand,
} from '@aws-sdk/client-dynamodb-v2-node'
import { cellId } from '@bifravst/cell-geolocation-helpers'
import { StateDocument } from './types'
import { Location } from '../geolocateCell'

const TableName = process.env.CACHE_TABLE || ''
const dynamodb = new DynamoDBClient({})

export const handler = async ({
	roaming,
	cellgeo: { lat, lng },
}: StateDocument & { cellgeo: Location }): Promise<boolean> => {
	await dynamodb.send(
		new PutItemCommand({
			TableName,
			Item: {
				cellId: {
					S: cellId(roaming),
				},
				lat: {
					N: `${lat}`,
				},
				lng: {
					N: `${lng}`,
				},
			},
		}),
	)
	return true
}
