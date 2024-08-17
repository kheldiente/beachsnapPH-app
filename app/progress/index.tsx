import { DefaultFont } from '@/constants/Fonts';
import { LinearProgress } from '@rneui/themed';
import {
    View,
    Text,
    StyleSheet,
    ScrollView
} from 'react-native';
import AnimatedProgressWheel from 'react-native-progress-wheel';

const progressWheelOptions = (progress) => {
    return {
        color: 'darkseagreen',
        backgroundColor: 'lightgray',
        size: 170,
        width: 10,
        duration: 600,
        progress: progress,
        rounded: true
    }
}

const renderCurrentGoal = () => {
    const visited = 1;
    const totalBeachGoal = 3;
    const caption = `Complete your goal this month and unlock achievements. Share it with your friends!`;
    const progress = visited / totalBeachGoal;

    return (
        <View
            key={'_currGoal'}
            style={{
                backgroundColor: 'papayawhip',
                borderRadius: 10,
                padding: 15,
                margin: 10,
            }}
        >
            <Text
                key={'_currGoal_header'}
                style={styles.headerText}
            >
                Current Goal
            </Text>
            <View
                key={'_currGoal_msg'}
                style={{
                    flex: 1,
                    flexDirection: 'row'
                }}
            >
                <Text
                    style={{
                        ...styles.headerText,
                        fontSize: 40,
                        alignSelf: 'center',
                    }}
                >
                    {visited}
                </Text>
                <Text
                    style={{
                        ...styles.headerText,
                        fontSize: 14,
                        fontWeight: '500',
                        marginLeft: 5,
                        color: 'darkgray',
                        alignSelf: 'center'
                    }}
                >
                    {`visted out of ${totalBeachGoal} beaches`}
                </Text>
            </View>
            <LinearProgress
                key={'_currGoal_progress'}
                style={{
                    width: '100%',
                    height: 6,
                    marginBottom: 10,
                    borderRadius: 10,
                }}
                value={progress}
                variant="determinate"
            />
            <Text
                key={'_currGoal_caption'}
                style={{
                    ...styles.statsTitle,
                    flexWrap: 'wrap'
                }}
            >
                {caption}
            </Text>
        </View>
    )
}

const renderStatCard = (data) => {
    const list = data.list ?? [
        {
            name: 'Cemento Beach',
            dateRange: 'Feb 14, 2024',
            photosTaken: 3
        },
        {
            name: 'Casapsapan Beach',
            dateRange: 'Feb 13, 2024',
            photosTaken: 4
        },
        {
            name: 'Canawer Beach',
            dateRange: 'Feb 13, 2024',
            photosTaken: 2
        },
        {
            name: 'Pinamuntugan Beach',
            dateRange: 'Dec 20, 2023',
            photosTaken: 2
        },
        {
            name: 'Punta Beach',
            dateRange: 'Dec 20, 2023',
            photosTaken: 2
        },
    ];

    return (
        <View
            key={`visited_bchList+${data.key}`}
            style={{
                backgroundColor: 'papayawhip',
                borderRadius: 10,
                padding: 15,
                margin: 10,
            }}
        >
            <Text style={styles.headerText}>{data.title}</Text>
            {list.map((item) => (
                <View
                    key={`_visited_bchList+${item.name}`}
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                    }}
                >
                    <View style={{
                        flex: 1,
                        flexDirection: 'column',
                        marginTop: 10,
                    }}>
                        <Text style={{
                            fontFamily: DefaultFont.fontFamily,
                            fontSize: 15,
                            color: 'black',
                            fontWeight: '200',
                        }}>{item.name}</Text>
                        <Text style={{
                            fontFamily: DefaultFont.fontFamily,
                            fontSize: 10,
                            color: 'gray'
                        }}>{item.dateRange}</Text>
                    </View>
                    <Text style={{
                        fontFamily: DefaultFont.fontFamily,
                        fontSize: 12,
                        alignSelf: 'center',
                        color: 'black',
                        fontWeight: 'bold',
                    }}>{item.photosTaken} photos</Text>
                </View>
            ))}
        </View>
    )
}

export default function ProgressListLayout() {
    const totalBeaches = 300;
    const visitedBeaches = 25;
    const stats = [
        {
            statsCount: 2,
            total: 17,
            title: 'regions'
        },
        {
            statsCount: 3,
            total: 34,
            title: 'provinces'
        },
        {
            statsCount: 5,
            total: 50,
            title: 'municipalities'
        },
    ]

    const renderStats = (stat) => {
        return (
            <View
                key={`_stats+${stat.title}_${stat.statsCount}`}
                style={{
                    flex: 1,
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Text style={styles.statsCount}>{stat.statsCount}</Text>
                <Text style={{
                    fontFamily: DefaultFont.fontFamily,
                    fontSize: 10,
                    alignSelf: 'center',
                    color: 'gray'
                }}>out of {stat.total}</Text>
                <Text style={styles.statsTitle}>{stat.title}</Text>
            </View>
        )
    }

    return (
        <ScrollView
            style={styles.root}
            showsVerticalScrollIndicator={false}
        >
            <View
                key={'_progWhl_container'}
                style={styles.container}
            >
                <AnimatedProgressWheel
                    key={'_progWhl'}
                    max={totalBeaches}
                    showProgressLabel={true}
                    rotation={'-90deg'}
                    subtitle={`visited out of \r\n ${totalBeaches} beaches`}
                    labelStyle={styles.labelText}
                    subtitleStyle={styles.text}
                    animateFromValue={0}
                    {...progressWheelOptions(visitedBeaches)}
                />
            </View>
            <View
                key={'_stat_container'}
                style={styles.statsContainer}
            >
                {stats.map((stat) =>
                    renderStats(stat)
                )}
            </View>
            {renderCurrentGoal()}
            {renderStatCard({ title: 'Recent visited beaches', key: 'stat1' })}
            {renderStatCard({ title: 'Top beaches with many photos', key: 'stat2' })}
            {renderStatCard({ title: 'Favorited beaches', key: 'stat3' })}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white',
    },
    container: {
        alignSelf: 'center',
        marginVertical: 20,
    },
    statsContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginVertical: 8,
    },
    headerText: {
        fontFamily: DefaultFont.fontFamily,
        fontSize: 16,
        color: 'black',
        fontWeight: 'bold',
    },
    text: {
        fontFamily: DefaultFont.fontFamily,
        fontSize: 10,
        color: 'gray'
    },
    statsCount: {
        fontFamily: DefaultFont.fontFamily,
        fontSize: 25,
        fontWeight: 'bold',
        color: 'black'
    },
    statsTitle: {
        fontFamily: DefaultFont.fontFamily,
        fontSize: 12,
        color: 'gray'
    },
    labelText: {
        fontFamily: DefaultFont.fontFamily,
        fontWeight: 'bold',
        fontSize: 40,
        color: 'gray'
    },
});
