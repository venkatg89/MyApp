import { Alert, Platform } from 'react-native';
import Permissions, { Permission, PermissionStatus, RESULTS, PERMISSIONS } from 'react-native-permissions';

class PermissionsHelper {

    private static async handleIOS(response: PermissionStatus, permissionType: Permission, title: string, message: string): Promise<boolean> {
        
        let result: boolean = false;

        if(response == RESULTS.GRANTED) {
            result = true;
        } else if (response !== RESULTS.BLOCKED) {
            await Permissions.request(permissionType).then((permissionStatus: PermissionStatus) => {
                result = (permissionStatus === RESULTS.GRANTED);
            }).catch((error: any) => {
                result = false;
            });
        } else {
            return new Promise((resolve) => {
                Alert.alert(
                    title,
                    message,
                    [
                        {
                            text: "Cancel", style: 'cancel',
                            onPress: (() => {
                                resolve(false);
                            })
                        },
                        {
                            text: "Settings",
                            onPress: (() => {
                                Permissions.openSettings();
                                resolve(false);
                            })
                        }
                    ]
                )
            })           
        }

        return result;
    }

    private static async handleAndroid(response: PermissionStatus, permissionType: Permission, title: string, message: string): Promise<boolean> {
        let result: boolean = false;
        if(response == RESULTS.GRANTED) {
            result = true;
        } else if (response !== RESULTS.BLOCKED) {
            await Permissions.request(permissionType).then((permission: string) => {
                if(permission === RESULTS.GRANTED){
                    result = true;
                }else{
                    return new Promise((resolve) => {
                        Alert.alert(
                            title,
                            message,
                            [
                                {
                                    text: "Cancel", style: 'cancel',
                                    onPress: (() => {
                                        resolve(false);
                                    })
                                },
                                {
                                    text: "Settings",
                                    onPress: (() => {
                                        Permissions.openSettings();
                                        resolve(false);
                                    })
                                }
                            ]
                        )
                    })
                }
            }).catch((error: any) => {
                result = false;
            });
        } else {
            return new Promise((resolve) => {
                Alert.alert(
                    title,
                    message,
                    [
                        {
                            text: "Cancel", style: 'cancel',
                            onPress: (() => {
                                resolve(false);
                            })
                        },
                        {
                            text: "Settings",
                            onPress: (() => {
                                Permissions.openSettings();
                                resolve(false);
                            })
                        }
                    ]
                )
            })
        }

        return result;
    }

    public static async requestPermission(permissionType: Permission, title: string, message: string): Promise<boolean> {
        let result: boolean = false;
        await Permissions.check(permissionType)
            .then(async (response) => {

                if (Platform.OS === "android") {
                    if (response === RESULTS.UNAVAILABLE && permissionType === PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION) {
                        await Permissions.check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
                        .then(async (response) => {
                            result = await this.handleAndroid(response, PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION, title, message);
                        }).catch((error: string) => {
                            result = false;
                        })
                    } else {
                        result = await this.handleAndroid(response, permissionType, title, message);
                    }
                    
                } else {
                    result = await this.handleIOS(response, permissionType, title, message);
                }

            }).catch((error: string) => {
                result = false;
            });

        return result;
    }

    public static async requestMultiplePermissions(permissionsFor: { permissionType: Permission, title: string, message: string }[]): Promise<boolean> {
        let result: boolean = false;

        var permissionsLength = permissionsFor.length;

        if(permissionsLength == 0) {
            result = true;
        } else {
            for (var i = 0; i < permissionsLength; i++) {
                const { permissionType, title, message } = permissionsFor[i];
                await Permissions.check(permissionType)
                    .then(async (response) => {
                        if (Platform.OS === "android")
                            result = await this.handleAndroid(response, permissionType, title, message);
                        else
                            result = await this.handleIOS(response, permissionType, title, message);

                    }).catch((error: string) => {
                        result = false;
                    });

                if (!result)
                    break;
            }
        }
        return result;
    }
}

export { PermissionsHelper };
