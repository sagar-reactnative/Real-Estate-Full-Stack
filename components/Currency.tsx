import { Text } from 'react-native'
import React from 'react'

const Currency = ({ amount, style }: { amount: number, style: any }) => {
    const formattedAmount = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0, // Ensures no decimal points for whole numbers
    }).format(amount);

    return <Text className={style}>{formattedAmount}</Text>;
}

export default Currency
