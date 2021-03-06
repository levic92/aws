import * as E from 'fp-ts/lib/Either'
import { ErrorInfo, ErrorType } from '../ErrorInfo'
import * as Ajv from 'ajv'

export const validate = <T>(schema: Ajv.ValidateFunction) => (
	value: any,
) => (): E.Either<ErrorInfo, T> => {
	const valid = schema(value)
	if (!valid) {
		return E.left({
			type: ErrorType.BadRequest,
			message: 'Validation failed!',
			detail: schema.errors,
		})
	}
	return E.right(value as T)
}
