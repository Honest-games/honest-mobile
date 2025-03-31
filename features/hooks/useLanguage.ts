import i18n from 'i18next'
import { changeLanguage } from '@/constants/i18n/i18n.config'
import { useAppDispatch } from '@/features/hooks/useRedux'
import { setLanguage } from '@/store/reducer/language-slice'

const useLanguage = () => {
	const dispatch = useAppDispatch()

	const toggleLanguage = async () => {
		const newLanguage = i18n.language === 'en' ? 'ru' : 'en'
		await changeLanguage(newLanguage)
		dispatch(setLanguage(newLanguage))
	}

	return {
		toggleLanguage
	}
}

export default useLanguage
