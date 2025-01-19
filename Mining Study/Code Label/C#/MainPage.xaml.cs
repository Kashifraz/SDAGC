using Plugin.BLE;
using Plugin.BLE.Abstractions.Contracts;
using Plugin.BLE.Abstractions.EventArgs;
// using Plugin.BLE.Abstractions.Exceptions;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
// using System.ComponentModel;
// using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Xamarin.CommunityToolkit.UI.Views;
using Xamarin.CommunityToolkit.Extensions;
using Xamarin.Forms;
using Xamarin.Essentials;
using LiveChartsCore;
using LiveChartsCore.Defaults;
using LiveChartsCore.SkiaSharpView;
using LiveChartsCore.SkiaSharpView.Painting;
using SkiaSharp;


namespace BLE_Universal
{
    public partial class MainPage : ContentPage
    {
        // Plugin.BLE Documentation for Xamarin Forms package
        // https://github.com/dotnet-bluetooth-le/dotnet-bluetooth-le
        //---------------------------------------------------------------------------------------
        public IAdapter adapter;
        public IBluetoothLE bluetoothBLE;
        public ObservableCollection<IDevice> list;
        public ObservableCollection<string> namelist;
        public IDevice device1, device2, device3, device4, device5;
        public IDevice temp_device;
        Popup popup;
        int SELECTED;
        public Dictionary<char, float> S = new Dictionary<char, float>() { { '0', 1.0f }, { '1', -1.0f } };

        public Dictionary<string, string> BLE_MAP = new Dictionary<string, string>
        {
            {"IFM_FIBER_51", "1A. Subject 1 Shirt 1"},
            {"IFM_FIBER_52", "1B. Subject 2 Shirt 2"},
            {"IFM_FIBER_57", "1B. Subject 16 Shirt 3"},

            {"IFM_FIBER_54", "2B. Subject 5 Shirt 5"},
            {"IFM_FIBER_55", "1A. Subject 7 Shirt 6"},
            {"IFM_FIBER_61", "2B. Subject 6 Shirt 7"},

            {"IFM_FIBER_56", "1B. Subject 22 Shirt 8"},
            {"IFM_FIBER_71", "2A. Subject 24 Shirt 9"},
            {"IFM_FIBER_67", "1B. Subject 10 Shirt 10"},

            {"IFM_FIBER_76", "1A. Subject 19 Shirt 13"},
            {"IFM_FIBER_63", "2B. Subject 14 Shirt 14"},
            {"IFM_FIBER_64", "1A. Subject 15 Shirt 15"},

            {"IFM_FIBER_72", "2A. Subject 17 Shirt 17"},
            {"IFM_FIBER_99", "2B. Subject 18 Shirt 18"},
            {"IFM_FIBER_98", "2B. Subject 25 Shirt 19"},

            {"IFM_FIBER_75",  "1A. Subject 20 Shirt 20"},
            {"IFM_FIBER_102", "1B. Subject 21 Shirt 21"},
            {"IFM_FIBER_103", "2A. Subject 11 Shirt 22"},

            {"IFM_FIBER_104", "2A. Subject 23 Shirt 23"},

            {"IFM_FIBER_53", "2A. Subject 4 Shirt 4"},
        };
        
        //---------------------------------------------------------------------------------------

        CancellationTokenSource cancelsource1; CancellationToken canceltoken1;
        CancellationTokenSource cancelsource2; CancellationToken canceltoken2;
        CancellationTokenSource cancelsource3; CancellationToken canceltoken3;
        public ObservableCollection<IService> d1s1 = new ObservableCollection<IService>();
        public ObservableCollection<IService> d1s2 = new ObservableCollection<IService>();
        public ObservableCollection<IService> d2s1 = new ObservableCollection<IService>();
        public ObservableCollection<IService> d2s2 = new ObservableCollection<IService>();
        public ObservableCollection<IService> d3s1 = new ObservableCollection<IService>();
        public ObservableCollection<IService> d3s2 = new ObservableCollection<IService>();     
        public ObservableCollection<ICharacteristic> d1c1 = new ObservableCollection<ICharacteristic>();
        public ObservableCollection<ICharacteristic> d1c2 = new ObservableCollection<ICharacteristic>();
        public ObservableCollection<ICharacteristic> d2c1 = new ObservableCollection<ICharacteristic>();
        public ObservableCollection<ICharacteristic> d2c2 = new ObservableCollection<ICharacteristic>();
        public ObservableCollection<ICharacteristic> d3c1 = new ObservableCollection<ICharacteristic>();
        public ObservableCollection<ICharacteristic> d3c2 = new ObservableCollection<ICharacteristic>();

        // ***
        private Dictionary<string, ObservableCollection<ObservablePoint>> _tags1;

        // public event PropertyChangedEventHandler PropertyChanged;
        // protected virtual void OnPropertyChanged(string propertyName = null)
        // {
        //     PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        // }

        ObservableCollection<ISeries> _Series1;
        public ObservableCollection<ISeries> Series1
        {
            get { return this._Series1; }
            set
            {
                this._Series1 = value;
                OnPropertyChanged("Series1");
            }
        }

        public ObservableCollection<ObservablePoint> accel_data = new ObservableCollection<ObservablePoint>();

        public Axis[] X_Axis { get; set; } = {
            new Axis
            {
                Name = "Seconds Elapsed",
                TextSize=14,
            }
        };

        public Axis[] Y_Axis { get; set; } = {
            new Axis
            {
                Name = "Temperature (°C)",
                TextSize=14,
                // MinLimit=-5,
                // MaxLimit=30,
            }
        };

        public DateTime START_TIME; // To calculate seconds elapsed in AddOrUpdateTagData()

        //***********************************************************************************************************


        // CONSTRUCTOR: Initialize the MainPage
        public MainPage()
        {
            InitializeComponent();
            adapter = CrossBluetoothLE.Current.Adapter;
            bluetoothBLE = CrossBluetoothLE.Current;
            SELECTED = 0;

            list = new ObservableCollection<IDevice>();            // Set up list of devices
            namelist = new ObservableCollection<string>();         // Set up list of device names

            adapter.DeviceDiscovered += OnDeviceDiscovered;        // Set up event handlers
            adapter.DeviceConnectionLost += OnDeviceDisconnected;
            
            Device.BeginInvokeOnMainThread(() =>
            {
                // startimage.Source = new FileImageSource { File = "start.png" };
                // eraseimage.Source = new FileImageSource { File = "erase.png" };
                // Shirt1.Source = new FileImageSource { File = "Man30.png" };
                // Shirt2.Source = new FileImageSource { File = "Man30.png" };

                ConnectButtonText.Text = "Connect";
                ConnectColor.Color     = Color.FromHex("#CFCFCF");
                StartButtonText.Text   = "Send Time then Plot";
                StartColor.Color       = Color.FromHex("#CFCFCF");

                Series1 = new ObservableCollection<ISeries>
                {
                    new LineSeries<ObservablePoint> { Name="accel", Values=accel_data, Fill=null, GeometrySize=0.75, },
                };

                DateTimeText.Text = "----";
                DateTimeText.TextColor = Color.FromHex("#6F6F6F");

                LiveAccelPlot.Series = Series1;
                LiveAccelPlot.XAxes = X_Axis;
                LiveAccelPlot.YAxes = Y_Axis;
            });
        }


        // HANDLER: Handle the scanning of devices
        private void OnDeviceDiscovered(object sender, DeviceEventArgs args)
        {
            Device.BeginInvokeOnMainThread(() =>
            {
                if ((!list.Contains(args.Device)) && (args.Device.Name != null) && args.Device.Name.Contains("IFM"))
                {
                    list.Add(args.Device);
                    
                    string dev_name = BLE_MAP.ContainsKey(args.Device.Name) ? BLE_MAP[args.Device.Name] : args.Device.Name;

                    if (!namelist.Contains(dev_name))
                        namelist.Add(dev_name);
                }
            });
        }


        // HANDLER: Handle the disconnection of devices
        private void OnDeviceDisconnected(object sender, DeviceEventArgs args)
        {
            Device.BeginInvokeOnMainThread(() =>
            {
                ClearDevice(args.Device);
            });
        }


        // HELPER FUNCTION: Adjust scanning mode and scans for specific timeout
        private async void SearchDevices(object sender, EventArgs e)
        {
            list.Clear();
            adapter.ScanTimeout = 10000;
            adapter.ScanMode = ScanMode.LowLatency; // Previously ScanMode.Balanced before 1.8.22
            await adapter.StartScanningForDevicesAsync();
        }


        // BUTTON: Connect to a device
        private async void ConnectDevice(object sender, EventArgs e)
        {
            list.Clear();
            var listview = new ListView
            { 
                ItemsSource = list,
                ItemTemplate = new DataTemplate(() =>
                {
                    var cell = new TextCell();
                    cell.SetBinding(TextCell.TextProperty, "Name");
                    cell.TextColor = Color.Black;
                    return cell;
                })
            };
            listview.ItemSelected += OnItemSelected;

            popup = new Popup
            {
                Content = new StackLayout
                {
                    Children =
                    {
                        new Label   // Header of List
                        {
                            Text = "Connect to Fiber",
                            FontAttributes = FontAttributes.Bold,
                            TextColor = Color.Black,
                            FontSize = 16,
                            Margin = new Thickness(0, 10)
                        },
                        listview,  // List of Devices Found
                    }
                },
            };

            SearchDevices(null, null);
            var result = await App.Current.MainPage.Navigation.ShowPopupAsync(popup); // Show the Popup
        }


        // BUTTON: Attempt connection for associated device slot
        async void OnItemSelected(object sender, SelectedItemChangedEventArgs e)
        {
            if (device1==null)
            {
                device1 = e.SelectedItem as IDevice;
                await Setup_Device(0, device1);
            }
            else
            {
                await DisplayAlert("Error!", "A fiber is already connected.", "OK");
                return;
            }

            // // Find index of selected name in namelist
            // int index = namelist.IndexOf(e.SelectedItem as string);

            // // Get the device from the list of devices
            // temp_device = list.ElementAt(index);

            // if (SELECTED==1 && device1==null)
            // {
            //     device1 = temp_device;
            //     await Setup_Device(0, device1);
            // }
            // else if (SELECTED==2 && device2==null)
            // {
            //     device2 = temp_device;
            //     await Setup_Device(1, device2);
            // }
            // else if (SELECTED==3 && device3==null)
            // {
            //     device3 = temp_device;
            //     await Setup_Device(2, device3);
            // }
            // else if (SELECTED==4 && device4==null)
            // {
            //     device4 = temp_device;
            //     await Setup_Device(3, device4);
            // }
            // else if (SELECTED==5 && device5==null)
            // {
            //     device5 = temp_device;
            //     await Setup_Device(4, device5);
            // }
            // else
            // {
            //     await DisplayAlert("Error", "All devices are connected.", "OK");
            //     return;
            // }
        }


        // HELPER FUNCTION: Set up the device for connection
        async Task<int> Setup_Device(int index, IDevice d)
        {
            await adapter.StopScanningForDevicesAsync(); // Stop Scanner

            if (index==0)
            {
                try
                {
                    await adapter.ConnectToDeviceAsync(d);
                    // Fiber1.Text = BLE_MAP.ContainsKey(d.Name) ? BLE_MAP[d.Name] : d.Name;
                    // Fiber1.TextColor = Color.FromHex("#004A10");
                    // Shirt1.Source = new FileImageSource { File = "Green30.jpeg" };
                    cancelsource1 = new CancellationTokenSource(); canceltoken1 = cancelsource1.Token;
                    ServicesAndCharacteristics(0);
                }
                catch (Exception)
                {
                    // Fiber1.Text = "Error! Please retry.";
                    // Fiber1.TextColor = Color.FromHex("#E60008");
                    // Shirt1.Source = new FileImageSource { File = "Red.png" };
                    popup.Dismiss(null);
                    return 1;
                }
            }
            // else if (index==1)
            // {
            //     try
            //     {
            //         await adapter.ConnectToDeviceAsync(d);
            //         Fiber2.Text = BLE_MAP.ContainsKey(d.Name) ? BLE_MAP[d.Name] : d.Name;
            //         Fiber2.TextColor = Color.FromHex("#004A10");
            //         Shirt2.Source = new FileImageSource { File = "Green30.jpeg" };
            //         cancelsource2 = new CancellationTokenSource(); canceltoken2 = cancelsource2.Token;
            //         ServicesAndCharacteristics(1);
            //     }
            //     catch (Exception)
            //     {
            //         Fiber2.Text = "Error! Please retry.";
            //         Fiber2.TextColor = Color.FromHex("#E60008");
            //         Shirt2.Source = new FileImageSource { File = "Red.png" };
            //         popup.Dismiss(null);
            //         return 1;
            //     }
            // }
            // else if (index==2)
            // {
            //     try
            //     {
            //         await adapter.ConnectToDeviceAsync(d);
            //         Fiber3.Text = BLE_MAP.ContainsKey(d.Name) ? BLE_MAP[d.Name] : d.Name;
            //         Fiber3.TextColor = Color.FromHex("#004A10");
            //         Shirt3.Source = new FileImageSource { File = "Green30.jpeg" };
            //         cancelsource3 = new CancellationTokenSource(); canceltoken3 = cancelsource3.Token;
            //         ServicesAndCharacteristics(2);

            //     }
            //     catch (Exception)
            //     {
            //         Fiber3.Text = "Error! Please retry.";
            //         Fiber3.TextColor = Color.FromHex("#E60008");
            //         Shirt3.Source = new FileImageSource { File = "Red.png" };
            //         popup.Dismiss(null);
            //         return 1;
            //     }
            // }
            popup.Dismiss(null);
            return 0;
        }


        // HELPER FUNCTION: Set up the services and characteristics specific device.
        public async void ServicesAndCharacteristics(int index)
        {
            IReadOnlyList<IService> s_;

            switch (index)
            {
                case 0:
                    if (device1 == null) break;
                    s_ = await device1.GetServicesAsync();
                    for (int i = 0; i < s_.Count; i++)
                        switch (i)
                        {
                            case 0:
                                d1s1.Add(s_[i]);
                                IReadOnlyList<ICharacteristic> c1 = await s_[i].GetCharacteristicsAsync();
                                foreach (var c_ in c1) { d1c1.Add(c_); }
                                break;
                            case 1:
                                d1s2.Add(s_[i]);
                                IReadOnlyList<ICharacteristic> c2 = await s_[i].GetCharacteristicsAsync();
                                foreach (var c_ in c2) { d1c2.Add(c_); }
                                break;
                            default:
                                break;
                        }
                    break;
                case 1:
                    if (device2 == null) break;
                    s_ = await device2.GetServicesAsync();
                    for (int i = 0; i < s_.Count; i++)
                        switch (i)
                        {
                            case 0:
                                d2s1.Add(s_[i]);
                                IReadOnlyList<ICharacteristic> c1 = await s_[i].GetCharacteristicsAsync();
                                foreach (var c_ in c1) { d2c1.Add(c_); }
                                break;
                            case 1:
                                d2s2.Add(s_[i]);
                                IReadOnlyList<ICharacteristic> c2 = await s_[i].GetCharacteristicsAsync();
                                foreach (var c_ in c2) { d2c2.Add(c_); }
                                break;
                            default:
                                break;
                        }
                    break;
                case 2:
                    if (device3 == null) break;
                    s_ = await device3.GetServicesAsync();
                    for (int i = 0; i < s_.Count; i++)
                        switch (i)
                        {
                            case 0:
                                d3s1.Add(s_[i]);
                                IReadOnlyList<ICharacteristic> c1 = await s_[i].GetCharacteristicsAsync();
                                foreach (var c_ in c1) { d3c1.Add(c_); }
                                break;
                            case 1:
                                d3s2.Add(s_[i]);
                                IReadOnlyList<ICharacteristic> c2 = await s_[i].GetCharacteristicsAsync();
                                foreach (var c_ in c2) { d3c2.Add(c_); }
                                break;
                            default:
                                break;
                        }
                    break;
            }
        }


        async void OnStartClicked(object sender, EventArgs args)
        {
            byte[] epoch_array = new byte[6];
            START_TIME = DateTime.Now;
            epoch_array[0] = 0x1D; // Command
            epoch_array[1] = (byte)START_TIME.Month;
            epoch_array[2] = (byte)START_TIME.Day;
            epoch_array[3] = (byte)START_TIME.Hour;
            epoch_array[4] = (byte)START_TIME.Minute;
            epoch_array[5] = (byte)START_TIME.Second;

            int err = await d1c2[0].WriteAsync(epoch_array);

            StartColor.Color = Color.FromHex("#00A030");
            DateTimeText.Text = "Sent " + START_TIME.ToString("MM/dd/yyyy HH:mm:ss");
            DateTimeText.TextColor = Color.FromHex("#006F1F");

            Task.Delay(500).Wait();

            while (true)
            {
                err = await ProcessDeviceData(device1, d1c2);
                if (err != 0)
                    break;
            }
            return;
        }


        private async Task<int> ProcessDeviceData(IDevice device, ObservableCollection<ICharacteristic> connection)
        {
            // if (device==null)           // Check that device exists    
            //     return -1;
            // if (connection.Count < 3)   // Check that index 2 exists
            //     return -1;

            (byte[], int) bytes;
            try
            {
                bytes = await connection[3]?.ReadAsync();
            }
            catch (Exception)
            {
                // ClearDevice(device);
                return -1;
            }

            // bytes will be length 102. byte 1 is command, then 100 bytes data, then 1 dead byte.
            // we must parse the 100 bytes into 50 16-bit floats, then convert to 50 32-bit floats.

            double start_seconds = (float)(DateTime.Now - START_TIME).TotalSeconds;
            for (int i=1; i < 101; i+=2)
            {
                string t1 = CombineBytesToBinaryString(bytes.Item1[i], bytes.Item1[i+1]);

                accel_data.Add(
                    new ObservablePoint(
                        start_seconds + i * 0.017,           // X
                        Math.Round(ParseFloat16(t1), 2)     // Y
                    )
                );

                // If length of accel_data is above 800, remove the first element
                if (accel_data.Count>800)
                    accel_data.RemoveAt(0);

                // Task.Delay(millisecondsDelay:10).Wait(); // Let's delay for 3ms
            }

            Task.Delay(1100).Wait();
            return 0;
        }
        

        // HELPER: Remove a device from the list of connected devices if misc. exception
        private void ClearDevice(IDevice device)
        {
            if (device == device1)
            {
                cancelsource1.Cancel();
                // Fiber1.TextColor = Color.FromHex("#707070");
                // Shirt1.Source = new FileImageSource { File = "Man30.png" };
                device1 = null;
                d1s1.Clear(); d1s2.Clear(); d1c1.Clear(); d1c2.Clear();
            }
            else if (device == device2)
            {
                // cancelsource2.Cancel();
                // Fiber2.TextColor = Color.FromHex("#707070");
                // Shirt2.Source = new FileImageSource { File = "Man30.png" };
                // device2 = null;
                // d2s1.Clear(); d2s2.Clear(); d2c1.Clear(); d2c2.Clear();
            }
            else if (device == device3)
            {
                // cancelsource3.Cancel();
                // Fiber3.TextColor = Color.FromHex("#707070");
                // Shirt3.Source = new FileImageSource { File = "Man30.png" };
                // device3 = null;
                // d3s1.Clear(); d3s2.Clear(); d3c1.Clear(); d3c2.Clear();
            }
        }


        // BUTTON: Perform Chip Erase (0xCE) with device selector.
        async void OnChipErase(object sender, EventArgs args)
        {            
            List<string> validOptions = new List<string>();

            string str1 = device1?.Name;
            string str2 = device2?.Name;
            string str3 = device3?.Name;

            if (str1 != null) validOptions.Add(str1);
            if (str2 != null) validOptions.Add(str2);
            if (str3 != null) validOptions.Add(str3);

            if (validOptions.Count == 0)
            {
                await DisplayAlert("Error!", "No devices connected.", "OK");
                return;
            }

            string action = await DisplayActionSheet(
                "Select a device to chip erase", "Cancel", null,
                validOptions.ToArray()
            );

            if (action == str1)
            {
                if (device1 == null) await DisplayAlert("Error!", "No device connected.", "OK");
                else await d1c2[0].WriteAsync(new byte[] { 0xCE });
            }
            else if (action == str2)
            {
                if (device2 == null) await DisplayAlert("Error!", "No device connected.", "OK");
                else await d2c2[0].WriteAsync(new byte[] { 0xCE });
            }
            else if (action == str3)
            {
                if (device3 == null) await DisplayAlert("Error!", "No device connected.", "OK");
                else await d3c2[0].WriteAsync(new byte[] { 0xCE });
            }
            else
                return; 
        }


        // HELPER FUNCTION: Combine two bytes into a single binary string.
        static string CombineBytesToBinaryString(byte byte1, byte byte2)
        {
            return Convert.ToString(byte1, 2).PadLeft(8, '0') + Convert.ToString(byte2, 2).PadLeft(8, '0');
        }


        // HELPER FUNCTION: Convert a binary string to a float, written by ChatGPT 3.5, converted from my original Python code.
        float ParseFloat16(string binfloat)
        {
            char sign = binfloat[0];
            string exp = binfloat.Substring(1, 5);
            string mantissa = binfloat.Substring(6);

            if (exp == "00000")
            {
                if (mantissa == "0000000000")  // Underflow
                    return 0.0f;
                else
                    return S[sign] * (float)Math.Pow(2, -14) * (Convert.ToInt32(mantissa, 2) * (float)Math.Pow(2, -10));
            }
            else if (exp == "11111")    // Overflow case
            {
                if (sign == '0')
                    return float.NaN;   // Currently set to NaN, this could be float.PositiveInfinity
                else if (sign == '1')
                    return float.NaN;   // Currently set to NaN, this could be float.NegativeInfinity
            }
            else
            {
                float fraction = 1.0f + (Convert.ToInt32(mantissa, 2) * (float)Math.Pow(2, -10));
                return S[sign] * fraction * (float)Math.Pow(2, Convert.ToInt32(exp, 2) - 15); // 15 is half-precision bias
            }

            return 0.0f;  // This line is unreachable, but C# requires a return statement in all code paths
        }

    }
}
