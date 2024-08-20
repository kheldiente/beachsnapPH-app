export const AppFonts = {
    SpaceMono: require('@/assets/fonts/SpaceMono-Regular.ttf'),
    Nunito: require('@/assets/fonts/Nunito-Regular.ttf'),
    NunitoBold: require('@/assets/fonts/Nunito-Bold.ttf'),
    NunitoMedium: require('@/assets/fonts/Nunito-Medium.ttf'),
    NunitoLight: require('@/assets/fonts/Nunito-Light.ttf')
}

// We're loading it via useFonts() in _layout.tsx
export const DefaultFont = {
    fontFamily: 'Nunito',
    fontFamilyBold: 'NunitoBold',
    fontFamilyMedium: 'NunitoMedium',
    fontFamilyLight: 'NunitoLight',
}