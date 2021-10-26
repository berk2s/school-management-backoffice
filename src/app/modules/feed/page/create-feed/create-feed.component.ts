import { Component, OnDestroy, OnInit } from '@angular/core'
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms'
import { AlertService } from '@app/alert/alert.service'
import { Observable } from 'rxjs'
import {
  debounceTime,
  exhaustMap,
  take,
  throttle,
  throttleTime,
  withLatestFrom,
} from 'rxjs/operators'
import { FeedService } from 'src/app/data/feed/service/feed.service'
import {
  AnnouncementChannel,
  CreatingAnnouncement,
} from 'src/app/data/feed/types/feed.types'
import { FeedListComponent } from '../feed-list/feed-list.component'

@Component({
  selector: 'app-create-feed',
  templateUrl: './create-feed.component.html',
  styleUrls: ['./create-feed.component.scss'],
})
export class CreateFeedComponent implements OnInit, OnDestroy {
  feedForm: FormGroup
  announcementStatus: AbstractControl

  selectedFiles?: FileList
  selectedFileNames: string[] = []

  progressInfos: any[] = []
  message: string[] = []

  previews: string[] = []
  imageInfos: Observable<any>

  constructor(
    private formBuilder: FormBuilder,
    private feedListComponent: FeedListComponent,
    private alertService: AlertService,
    private feedService: FeedService,
  ) {}

  ngOnInit(): void {
    this.feedListComponent.matDrawer.open()

    this.feedForm = this.formBuilder.group({
      announcementTitle: ['', Validators.required],
      announcementDescription: [''],
      announcementChannels: [[], Validators.required],
      announcementStatus: [true],
    })

    this.announcementStatus = this.feedForm.controls['announcementStatus']
  }

  ngOnDestroy(): void {
    this.feedListComponent.matDrawer.close()
  }

  setActivate(value: boolean): void {
    this.feedForm.controls['announcementStatus'].setValue(value)
  }

  selectFiles($event: any): void {
    const self = this
    self.message = []
    self.progressInfos = []
    self.selectedFileNames = []
    self.selectFiles = $event.target.files
    self.previews = []

    if (self.selectFiles && self.selectFiles[0]) {
      const numberOfFiles = self.selectFiles.length

      for (let i = 0; i < numberOfFiles; i++) {
        if ($event.target.files[i]) {
          const reader = new FileReader()

          reader.onload = (e: any) => {
            self.previews.push(e.target.result)
          }

          reader.readAsDataURL(self.selectFiles[i])

          self.selectedFileNames.push(self.selectFiles[i].name)
        }
      }
    }
  }

  save(): void {
    const announcementChannelArr = []

    for (let announcementChannel of this.feedForm.get('announcementChannels')
      .value) {
      const transformedChannel = Object.keys(AnnouncementChannel).find(
        (key) => AnnouncementChannel[key] === announcementChannel,
      )

      if (transformedChannel) {
        announcementChannelArr.push(transformedChannel)
      }
    }

    const creatingAnnouncement: CreatingAnnouncement = {
      ...this.feedForm.value,
      announcementChannels: announcementChannelArr,
    }

    this.feedService
      .saveAnnouncement(creatingAnnouncement)
      .pipe(
        take(1),
        withLatestFrom(this.feedService.pagination$),
        exhaustMap((data) => {
          const pagination = data[1]
          return this.feedService
            .getAnnouncements(
              pagination.page,
              pagination.size,
              pagination.sortedBy,
              pagination.order,
            )
            .pipe(take(1))
        }),
      )
      .subscribe(() => {
        this.feedForm.reset()
        this.announcementStatus.setValue(true)

        this.alertService.sendMessage({
          alertTitle: 'Başarılı',
          alertContent: 'Duyuru başarılı bir şekilde oluşturuldu',
          alertType: 'success',
        })
      })
  }

  getAnnouncementChannels() {
    const arr = []
    for (const [key, value] of Object.entries(AnnouncementChannel)) {
      arr.push(value)
    }
    return arr
  }
}
