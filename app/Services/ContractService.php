<?php

namespace App\Services;

use App\Models\Contract;
use App\Models\User;
use App\Notifications\ContractCreatedNotification;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Storage;

class ContractService
{
    public function create(array $data, User $user): Contract
    {
        return DB::transaction(function () use ($data, $user) {
            if (isset($data['file']) && $data['file'] instanceof UploadedFile) {
                $fileData = $this->uploadFile($data['file'], $user->company_id);
                $data = array_merge($data, $fileData);
                unset($data['file']);
            }

            if (isset($data['termination_notice_days']) && $data['termination_notice_days']) {
                $data['termination_deadline_date'] = null;
            }

            $data['company_id'] = $user->company_id;
            $data['created_by'] = $user->id;

            $contract = Contract::create($data);

            // Notify all company users about the new contract
            $companyUsers = User::where('company_id', $user->company_id)->get();
            
            Notification::send($companyUsers, new ContractCreatedNotification($contract, $user));

            return $contract->load(['contractType', 'creator']);
        });
    }

    public function update(Contract $contract, array $data): Contract
    {
        return DB::transaction(function () use ($contract, $data) {
            if (isset($data['file']) && $data['file'] instanceof UploadedFile) {
                if ($contract->file_path) {
                    Storage::disk('s3')->delete($contract->file_path);
                }
                
                $fileData = $this->uploadFile($data['file'], $contract->company_id);
                $data = array_merge($data, $fileData);
                unset($data['file']);
            }

            if (isset($data['termination_notice_days']) && $data['termination_notice_days']) {
                $data['termination_deadline_date'] = null;
            }

            $contract->update($data);

            return $contract->fresh(['contractType', 'creator']);
        });
    }

    public function delete(Contract $contract): bool
    {
        return DB::transaction(function () use ($contract) {
            if ($contract->file_path) {
                Storage::disk('s3')->delete($contract->file_path);
            }

            return $contract->delete();
        });
    }

    protected function uploadFile(UploadedFile $file, int $companyId): array
    {
        $path = Storage::disk('local')->putFile(
            "companies/{$companyId}/contracts",
            $file,
            'private'
        );

        return [
            'file_path' => $path,
            'file_name' => $file->getClientOriginalName(),
            'file_mime' => $file->getMimeType(),
            'file_size' => $file->getSize(),
        ];
    }

    public function getDownloadUrl(Contract $contract): ?string
    {
        if (!$contract->file_path) {
            return null;
        }

        return Storage::disk('local')->temporaryUrl(
            $contract->file_path,
            now()->addMinutes(60)
        );
    }
}
