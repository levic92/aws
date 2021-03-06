import { S3 } from 'aws-sdk'
import { format } from 'date-fns'

const s3 = new S3()
const Bucket = process.env.HISTORICAL_DATA_BUCKET || ''

/**
 * Processes batch messages and stores them on S3
 */
export const handler = async (event: {
	message: { [key: string]: any[] }
	deviceId: string
	messageId: string
	timestamp: number
}) => {
	const { message, deviceId, messageId, timestamp } = event

	let id = 0

	return Promise.all(
		Object.keys(message).map(async key =>
			Promise.all(
				message[key].map(async body => {
					const Key = `updates/raw/${format(timestamp, 'yyyy/MM/dd')}/${format(
						timestamp,
						"yyyyMMdd'T'HHmmss",
					)}-${deviceId}-${messageId}-${++id}.json`
					const Body = {
						reported: {
							[key]: body,
						},
						timestamp: format(timestamp, 'yyyy-MM-dd HH:mm:ss.S'),
						deviceId,
					}
					console.log(
						JSON.stringify({
							Key,
							Body,
						}),
					)
					return s3
						.putObject({
							Bucket,
							Key,
							Body: JSON.stringify(Body),
						})
						.promise()
				}),
			),
		),
	)
}
